---
layout: post
title: "Metal 3D Graphics Part 3: A 3D Cube"
date: 2019-01-27
categories: Metal
isEditable: true
editPath: _posts/metal/metal-3.md
subscribeName: Metal
---

# Recap

In the [previous post][previous post] we continued exploring the [Metal][metal website] APIs by working on animating the brightness of our colored triangle:

![Animated Colored Triangle][old_screen1]

To do so, we did the following:

- Add a second `MTLBuffer` in addition to the `MTLBuffer` that contains vertex data. This new buffer contains data that is the same for all vertices (**uniform**), and can be written to by the Swift code on the CPU, and read from the Metal fragment shader code on the GPU.
- In the fragment shader, read the desired brightness value from the fragment uniforms buffer, and use it to affect the brightness of rendered pixels.
- Since the CPU is writing to the fragment uniforms buffer and the GPU is reading from it, we had to ensure that these events can not overlap, which we achieved by using a semaphore.

By now we have introduced most of the fundamental concepts that are unique to the Metal API. However, Metal is ostensibly an API for 3D graphics and thus far we have not done any 3D rendering, which feels rather lacking. In this post and future posts we will build upon the core foundation of Metal we have seen by building up more complex 3D graphics techniques, and learn bits of Metal as we need to. This post will start by introducing the basic ideas of how to accomplish 3D rendering. Use your code from the previous post, or feel free to [download my code][old_project_link] and use it.


# Challenges

1. We are currently computing the `brightness` using `cos()` on the CPU, and passing this to the GPU. Instead, try to pass the `currentTime` to the GPU, and compute the `brightness` on the GPU.
2. I wrote this post as passing the `brightness` uniform to the fragment shader. But we can accomplish the exact same thing by passing the `brightness` uniform to the vertex shader instead, and in the vertex shader modify the vertex colors before interpolation. Implement it this way instead.
3. In challenge #2 you achieved the exact same effect by modifying the vertex colors in the vertex shader instead of the fragment shader. Will this always be the case? As an example, try taking the `sqrt()` of each RGB color component in the vertex shader and compare to doing it in the fragment shader. Are they identical?
4. Use a time uniform to cause the triangle to grow and shrink. (Hint: what happens if you multiply the vertex positions by a number less than 1 or greater than 1?)


[previous post]: /metal/2018/07/29/metal-intro-2.html
[metal website]: https://developer.apple.com/metal/


[old_screen1]: /public/post_assets/metal/metal-intro-2/screen1.gif
[old_project_link]: /public/post_assets/metal/metal-intro-2/MetalFinal.zip

[project_link]: /public/post_assets/metal/metal-3/MetalFinal.zip