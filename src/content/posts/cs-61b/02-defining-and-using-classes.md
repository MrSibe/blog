---
title: CS 61B | Defining and Using Classes
published: 2025-11-03 10:56:24+08:00
description: CS 61B 学习笔记：Java 中类、对象、实例方法、静态方法和构造函数的区别。
tags:
- Java
- 面向对象
- 公开课
category: 课程笔记
draft: false
---

## 静态方法和非静态方法

概念解释：

| 猴子      | 猴子 20 岁了 | 猴子偷玉米 |
| ------- | -------- | ----- |
| 对于 OOP  | 属性       | 方法    |
| 对于 Java | 实例变量     | 函数    |

建立以下 两个文件：

```Java
// static方法
public class Dog {
    public static void makeNoise() {
        System.out.println("Bark!");
    }
}
```

```Java
public class DogLauncher {
    public static void main(String[] args) {
        Dog.makeNoise();
    }
}
```

在这里，`static` 是静态的意思。被它修饰的方法，应该直接用类名调用；而没有 static 的方法，应该先实例化一个类（生成一个对象），用对象名来调用方法：

```Java
// 非静态方法，也被称为实例方法
public class Dog {
    public void makeNoise() {
        System.out.println("Bark!");
    }
}
```

```Java
public class DogLauncher {
    public static void main(String[] args) {
    	Dog xibei = new Dog； // 这里实例化出一个xibei对象，类型为Dog。
        xibei.makeNoise();  // 这里通过对象名来调用方法。
    }
}
```

**总结：实例方法和实例变量需要实例化之后，通过对象名来使用；静态方法和静态变量可以直接使用类名来使用。**

## 构造器（Constructors）

实例化一个对象的时候，需要进行一些初始化（例如一个婴儿出生，需要有姓名、性别、体重等信息）。为了初始化这个对象，我们需要写构造器。

```java
public class Dog {
    public int weightInPounds;

	// 构造函数
    public Dog(int w) {
        weightInPounds = w;
    }

    public void makeNoise() {
        if (weightInPounds < 10) {
            System.out.println("yipyipyip!");
        } else if (weightInPounds < 30) {
            System.out.println("bark. bark.");
        } else {
            System.out.println("woof!");
        }    
    }
}
```

## 数组

数组也是需要实例化的：

```java
public class ArrayDemo {
    public static void main(String[] args) {
        /* Create an array of five integers. */
        int[] someArray = new int[5];
        someArray[0] = 3;
        someArray[1] = 4;
    }
}
```

## 类方法与实例方法

Java 允许我们定义两种类型的方法：

- 类方法，又名静态方法。
- 实例方法，又称非静态方法。

## 静态变量

类具有静态变量有时很有用。这些是类本身固有的属性，而不是实例。

## Main 函数

Main 函数长的像这样：

`public static void main(String[] args)`

解释一下：

- `public`：到目前为止，我们所有的方法都以这个关键字开头。
- `static`：它是一个静态方法，不与任何特定实例相关联。
- `void`：它没有返回类型。
- `main`：这是方法的名称。
- `String[] args`：这是传递给 main 方法的参数。
### 命令行参数

`String[] args` 意味着可以在命令行中给 main 函数传入多个参数。
