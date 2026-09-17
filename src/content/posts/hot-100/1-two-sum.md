---
title: Hot 100 | 1. 两数之和
published: 2025-10-25 14:20:20+08:00
description: 记录两数之和的几种解法，以及哈希表为什么能把查找过程降到线性时间。
tags:
- 算法
- 哈希表
- LeetCode
category: 课程笔记
draft: false
---

## 题目

给定一个整数数组 `nums` 和一个整数目标值 `target`，请你在该数组中找出 **和为目标值** _`target`_  的那 **两个** 整数，并返回它们的数组下标。

你可以假设每种输入只会对应一个答案，并且你不能使用两次相同的元素。

你可以按任意顺序返回答案。

**示例 1：**

**输入：** nums = [2,7,11,15], target = 9
**输出：**[0,1]
**解释：** 因为 nums[0] + nums[1] == 9 ，返回 [0, 1] 。

**示例 2：**

**输入：** nums = [3,2,4], target = 6
**输出：**[1,2]

**示例 3：**

**输入：** nums = [3,3], target = 6
**输出：**[0,1]

**提示：**

- `2 <= nums.length <= 104`
- `-109 <= nums[i] <= 109`
- `-109 <= target <= 109`
- **只会存在一个有效答案**

**进阶：** 你可以想出一个时间复杂度小于 `O(n2)` 的算法吗？

## 思路

### 思路一：暴力双重循环

直接遍历完所有的可能性。

```java
class Solution {  
    public int[] twoSum(int[] nums, int target) {  
        for (int i = 0; i < nums.length; i++) {  
            for (int j = i + 1; j < nums.length; j++) {  
                if (nums[i] + nums[j] == target) {  
                    return new int[]{i, j};  
                }  
            }  
        }  
        return new int[]{};  
    }  
}
```

时间复杂度高达 O(N^2)。

### 思路二：双指针

首先用快排排序，O(NlogN)；然后用双指针往中间移动：如果指针所指元素之和小于 `target` ，左指针右移，这样两个元素之和就可以变大；相反，如果指针所指元素之和大于 `target` ，右指针左移，这样两个元素之和就可以变小。

这样的做法比较麻烦的是需要自己写排序算法：因为最终程序输出的是索引，排序会把索引打乱，所以我们需要专门写一个索引数组，进行被排序数组同样的操作。

```java
class Solution {  
    public int[] twoSum(int[] nums, int target) {
    	// 创建索引数组
        int[] index = new int[nums.length];  
        for (int i = 0; i < nums.length; i++) {  
            index[i] = i;  
        }  
        
        // 排序
        Arrays.sort(nums);
        
        // 双指针
        int leftPointer = 0, rightPointer = nums.length - 1;  
        while (leftPointer < rightPointer) {  
        	// 如果和等于 target 则返回
            if (nums[leftPointer] + nums[rightPointer] == target) {  
                int left = index[leftPointer];  
                int right = index[rightPointer];  
                if (left < right) {  
                    return new int[]{left, right};  
                } else {  
                    return new int[]{right, left};  
                }  
            } else if (nums[leftPointer] + nums[rightPointer] < target) {  
                leftPointer++;  
            } else {  
                rightPointer--;  
            }  
        }
        // 没找到返回空数组
        return new int[]{};  
    }  
```

### 思路三：哈希表（最常用）

```java
class Solution {  
    public int[] twoSum(int[] nums, int target) {
    	Map<Integer, Integer> map = new HashMap<>();
    	for (int i = 0; i < nums.length; i++) {
    		if (map.containsKey(target - nums[i])) {
    			return new int[]{map.get(target - nums[i]), i};
    		}
    		map.put(nums[i], i);
    	}
        // 没找到返回空数组
        return new int[]{};  
    }  
```
