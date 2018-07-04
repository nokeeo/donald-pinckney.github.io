
#include <metal_stdlib>
using namespace metal;

#include "ShaderDefinitions.h"

struct VertexOut {
    float4 color;
    float4 pos [[position]];
};

vertex VertexOut vertexShader(const device Vertex *vertexArray [[buffer(0)]], unsigned int vid [[vertex_id]])
{
    // Get the data for the current vertex.
    Vertex in = vertexArray[vid];
    
    VertexOut out;
    
    // Pass the vertex color directly to the rasterizer
    out.color = in.color;
    // Pass the already normalized screen-space coordinates to the rasterizer
    out.pos = float4(in.pos.x, in.pos.y, 0, 1);
    
    return out;
}

fragment float4 fragmentShader(VertexOut interpolated [[stage_in]])
{
    float2 dVec = interpolated.pos.xy - float2(400, 300);
    float dist = sqrt(dot(dVec, dVec));
    if(dist < 100) {
        return float4(1, 0, 0, 1);
    } else {
        return float4(0, 0, 0, 1);
    }
}
