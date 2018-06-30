//
//  Renderer.swift
//  MetalIntro1
//
//  Created by Donald Pinckney on 6/30/18.
//  Copyright © 2018 donaldpinckney. All rights reserved.
//

import Foundation
import Metal
import MetalKit

class Renderer : NSObject, MTKViewDelegate {
    
    // This is the initializer for the Renderer class.
    // We will need access to the mtkView later, so we add it as a parameter here.
    init?(mtkView: MTKView) {
        
    }
    
    // mtkView will automatically call this function
    // whenever it wants new content to be rendered.
    func draw(in view: MTKView) {
        
    }
    
    // mtkView will automatically call this function
    // whenever the size of the view changes (such as resizing the window).
    func mtkView(_ view: MTKView, drawableSizeWillChange size: CGSize) {
        
    }
}
