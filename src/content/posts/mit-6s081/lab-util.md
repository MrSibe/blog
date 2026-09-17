---
title: MIT 6.S081 | Lab util
published: 2025-09-28 18:02:33+08:00
description: 我完成 MIT 6.S081 Lab util 时留下的实现记录，涉及系统调用、进程和管道。
tags:
- 操作系统
- Unix
- 公开课
category: 课程笔记
draft: false
---

## Sleep

Sleep 就是完成一个工具：`sleep [time]`，输入后休眠 `time` 秒。

完成这个工具需要掌握两个关键点：

1. 如何在 shell 中给程序传递参数
2. Sleep 的原理

### Main 函数传参

C 语言中，Main 函数要么传递参数，要么传递参数。下面的示例写的很清楚。第一种不传递参数，直接在参数列表写一个 void ，不写也是可以的；第二种传递参数看起来就比较迷惑了。

```c
int main(void) {
   // 无参数形式
   return 0;
}
int main(int argc, char *argv[]) {
   // 带参数形式
   return 0;
}
```

`int argc, char *argv[]`，这到底传递的是什么？Argc 其实是参数的个数，agrv 则是参数的指针。也就是说我们 main 函数需要一个大小为 `agrc` 的列表，名字叫 `argv`，范围是 `0-agrc-1` 。

比如说我们执行 `cp demo.c demo.cpp`，`agrc` 为 3，`argv` 为  `['cp', 'demo.c', 'demo.cpp']`。

那么 `argc` 和  `argv` 是如何得出的？这是 shell 的解析器在负责，不需要我们一个一个数参数到底有多少个。

总结一下：我们输入的指令，会被 shell 解析成 `argc` 和  `argv` ，然后交给 main 函数来使用。这里面还有更具体的流程，后面再说。

### Sleep 的原理

实验讲义里提示说让我们看看 `sysproc.c` 和 `user.h`。这就是实现 `sleep` 底层的代码。

`user.h` 提到了 sleep 系统调用的定义：`int sleep(int);`。传递一个整型，表示要休眠的时钟滴答数；返回一个整型返回值，返回 0 表示正常运行，返回 -1 表示非正常运行。这个 sleep 系统调用则是包装了下面的 `sys_sleep`。

`sysproc.c` 描述了 `sys_sleep` 实现：

```c
uint64 sys_sleep(void)
{
	int n;
	uint ticks0;
	// 参数不对，返回 -1 直接退出
	if(argint(0, &n) < 0) {
		return -1;
	}
	// 读写全局变量 ticks 前加锁，防止并发。
	acquire(&tickslock);
	// 通过读取 ticks 全局变量，ticks0 变量存储当前时间
	ticks0 = ticks;
	// 不停地检查时间，超过要求的时间就退出循环，这叫*忙等*
	while(ticks - ticks0 < n) {
		// 一旦中断，释放锁退出，返回 -1
		if(myproc()->killed) {
			release(&tickslock);
			return -1;
		}
		// sleep函数，这个函数可以让程序让出锁，避免占用资源
		sleep(&ticks, &tickslock);
	}
	// 退出循环，释放锁，返回0退出
	release(&tickslock);
	return 0;
}
```

这个系统调用有个好处：忙等检查和中间的让出机制，避免了程序持续对系统资源占用。想一想一个人在图书馆睡大觉，其他人还找不到图书馆的位置，这样是不是占用图书馆的资源呢？

### 解法

现在知道了程序如何传参，以及系统调用 sleep 是如何实现的，现在我们就动手来写自己的 `sleep` 实现。

```c
#include "kernel/types.h"
#include "user/user.h"

int main(int argc, char *argv[]) {
    int n;
    
    // 判断参数个数是否正确
    if(argc != 2) {
        fprintf(2, "usage: sleep <ticks>\n");
        exit(1);
    }

    // ticks 参数转换为整型
    n = atoi(argv[1]);
    
    // 判断 ticks 是否为正数
    if(n <= 0) {
        fprintf(2, "sleep: ticks must be positive\n");
        exit(1);
    }
    
    // sleep，发现返回值不对也需要报错
    if(sleep(n) != 0) {
        fprintf(2, "sleep: interrupted\n");
        exit(1);
    }
    exit(0);
}
```

网上的解答非常多，都可以多多参照。我的解法重点在于异常的处理。

## pingpong

第二个工具是 `pingpong`。它的功能简单来说就是创建两个进程通过两个管道传递信息。先不关具体我们怎么做，首先我们应当搞清楚：什么是进程？什么是管道？怎么去使用？

### 进程

**进程就是正在运行的程序。** 换句话说，你写的的代码是一个死气沉沉的文本文件，没有任何作用，只有让这个程序在计算机上运行起来，才能发挥作用。程序被计算机加载并运行，就成了进程。

**操作系统调度进程。** 电脑上时时刻刻都有数不清的进程在运行，但是 CPU 通常只有一个。这很像是小学经典奥数题：把水烧开需要 3 分钟，洗衣服需要 20 分钟，买蛋糕需要 5 分钟... 如何安排才能让自己完成这些事情的时间最少？计算机就面临这个问题，它要用有限的资源高效地做事情，就需要一个东西来调度进程执行的顺序与时间：什么时候运行这个进程，什么时候应该运行那个进程。这个活最开始是由人自己来做的，后来人太懒了，于是发明了操作系统，让操作系统帮忙调度进程的运行。

关于进程的创建，可以使用 `fork系统调用` 创建一个新的进程。`fork` 创建的新进程被称为**子进程**，其内存内容与调用的进程完全相同，原进程被称为**父进程**。在父进程和子进程中，fork都会返回一个值：在父进程中，fork返回子进程的PID（PID 可以理解为进程的编号，独一无二）；在子进程中，fork返回0。

获取进程的 PID 可以通过 `getpid`，直接返回当前进程的 PID。

进程的退出则简单多了：`exit 系统调用` 会使得调用它的进程退出。`exit` 需要一个整数状态参数，通常0表示成功，1表示失败。

还有一个操作，这对父进程适用：`wait 系统调用` 返回当前进程的一个已退出的子进程的PID。如果调用者的子进程都没有退出，则等待这个子进程退出。如果调用者没有子进程，wait立即返回-1。

以上便是目前需要了解的进程知识。进程需要学习的东西还有很多，后面继续讲。

### 管道

刚刚我们知道了进程是什么，而且还可以通过 fork 和 exit 来创建和退出进程。有意思的是进程不仅埋头苦干，还可以相互交流，他们之间交流的一种方式就是通过**管道**。想象一下，小时候你可能对着一个水管说话，水管的另一头还有个小伙伴用耳朵听你说的内容。这就是管道，进程就是通过如此“原始”的方法沟通的。

从上面的例子我们也可以看到，使用管道，必然有一个进程“说话”，另一个“倾听”，那我们该如何确定这个进程是在“说话”还是“倾听”呢？方法是**文件描述符**。文件描述符相当于一个整数“门票”，它标记了对文件的操作的入口。比如说我们想往一个文件写入字符串，那么我们只需要向这个文件的写入文件描述符发送字符串；如果我们想读取一个文件，只需要从这个文件的读取文件描述符读取字符串。

如果我们将管道看作文件，那么“说话”进程只需要向管道的写入文件描述符写入字符即可，“倾听”进程只需要向管道的读取文件描述符读取字符即可。（除了管道，UNIX 操作系统几乎把一切资源都视作文件，这是 UNIX 哲学的精髓）总的来说，使用管道，需要我们先创建管道的文件操作符，然后通过文件操作符来读取、写入信息。

创建一个管道需要用到 `pipe 系统调用`，例如：

```c
int p[2];
if (pipe(p) < 0) {
	printf("pipe() failed\n");
	exit(1);
}
```

在通过 `pipe` 创建管道之前，我们定义了 `p[2]`，这就是文件操作符。其中 `p[0]` 是读取，`p[1]` 是写入。`pipe` 需要传递这样的整数数组作为参数，同时返回一个整数值，创建失败则返回负数。

那么读取写入又是如何实现的呢？通过 `read` 和 `write`：

```c
char buf = 'x'; 

// 参数列表：文件描述符、传递内容的地址、传递内容的大小（字节）
write(p[1], &buf, 1);
read(p[0], &buf, 1);
```

### 解法

有了以上前提知识，我们就可以着手于 `pingpong` 程序的编写了。

```c
#include "kernel/types.h"
#include "user/user.h"

int main(void) {
    // 创建两个文件描述符、一个字节和一个pid变量
    int p2c[2], c2p[2];
    char buf = 'x';
    int pid;

    // 创建两个管道
    if(pipe(p2c) < 0 || pipe(c2p) < 0) {
        printf("pipe() failed\n");
        exit(1);
    }

    // 创建子进程
    pid = fork();
    if(pid < 0) {
        printf("fork() failed\n");
        exit(1);
    }

    // 通过pid判断当前进程是子进程还是父进程
    if(pid == 0) {
        // 子进程
        // 关闭不用的文件描述符
        close(p2c[1]);
        close(c2p[0]);

        // 读取父进程传来的字节
        if(read(p2c[0], &buf, sizeof(buf)) != 1) {
            printf("child: read failed\n");
            exit(1);
        }
        close(p2c[0]);
        printf("%d: received ping\n", getpid());

        // 写入字节
        if(write(c2p[1], &buf, sizeof(buf)) != sizeof(buf)) {
            printf("child: write failed\n");
            exit(1);
        }
        close(c2p[1]);
        exit(0);
    } else {
        // 父进程
        // 关闭不用的文件描述符
        close(p2c[0]);
        close(c2p[1]);

        // 写入字节
        if(write(p2c[1], &buf, sizeof(buf)) != sizeof(buf)) {
            printf("parent: write failed\n");
            exit(1);
        }
        close(p2c[1]);

        // 读取子进程传过来的字节
        if(read(c2p[0], &buf, sizeof(buf)) != 1) {
            printf("parent: read failed\n");
            exit(1);
        }
        close(c2p[0]);
        printf("%d: received pong\n", getpid());
        exit(0);
    }
}
```
