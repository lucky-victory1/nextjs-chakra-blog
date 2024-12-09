import React, { useState } from "react";
import { NodeViewWrapper, NodeViewProps, NodeViewContent } from "@tiptap/react";
import {
  Box,
  Image,
  ButtonGroup,
  IconButton,
  Tooltip,
  Flex,
} from "@chakra-ui/react";
import { Resizable, ResizableBox } from "react-resizable";
import { LuAlignLeft, LuAlignCenter, LuAlignRight } from "react-icons/lu";

export const MediaComponent: React.FC<NodeViewProps> = ({
  node,
  updateAttributes,
  selected,
  editor,
}) => {
  const [isResizing, setIsResizing] = useState(false);

  const alignments = [
    { icon: LuAlignLeft, value: "left" },
    { icon: LuAlignCenter, value: "center" },
    { icon: LuAlignRight, value: "right" },
  ];
  function setAlignment(alignment: "left" | "center" | "right") {
    switch (alignment) {
      case "left":
        return "0 auto 0 0";
      case "center":
        return "0 auto";
      case "right":
        return "0 0 0 auto";

      default:
        return "0 auto";
    }
  }
  return (
    <NodeViewWrapper className="media-wrapper">
      <NodeViewContent className="media-content">
        {editor?.isFocused ? (
          <Box pos={"relative"} w={"100%"} display={"inline-block"}>
            <ResizableBox
              className={selected ? "selected" : ""}
              resizeHandles={selected ? ["e", "ne", "nw", "se", "sw", "w"] : []}
              width={node.attrs.width}
              height={node.attrs.height}
              onResize={(e, { size }) => {
                updateAttributes({
                  width: size.width,
                  height: size.height,
                });
              }}
              onResizeStart={() => setIsResizing(true)}
              onResizeStop={() => setIsResizing(false)}
            >
              <>
                <Image
                  src={node.attrs.src}
                  alt={node.attrs.alt}
                  title={node.attrs.title}
                  style={{
                    width: node.attrs.width + "px",
                    height: node.attrs.height + "px",
                    objectFit: "contain",
                    margin: setAlignment(node.attrs.align),
                  }}
                />
              </>
            </ResizableBox>
            {selected && (
              <ButtonGroup
                size="sm"
                isAttached
                position="absolute"
                top="-40px"
                left="50%"
                transform="translateX(-50%)"
                bg="white"
                shadow="md"
                borderRadius="md"
                variant={"outline"}
              >
                {alignments.map(({ icon: Icon, value }) => (
                  <Tooltip key={value} label={`Align ${value}`}>
                    <IconButton
                      aria-label={`Align ${value}`}
                      icon={<Icon />}
                      onClick={() => updateAttributes({ align: value })}
                      _active={{ bg: "blue.500", color: "white" }}
                      isActive={node.attrs.align === value}
                    />
                  </Tooltip>
                ))}
              </ButtonGroup>
            )}
          </Box>
        ) : (
          <>
            <Image
              src={node.attrs.src}
              alt={node.attrs.alt}
              title={node.attrs.title}
              style={{
                width: node.attrs.width + "px",
                height: node.attrs.height + "px",
                objectFit: "contain",
                margin: setAlignment(node.attrs.align),
              }}
            />
          </>
        )}
      </NodeViewContent>
    </NodeViewWrapper>
  );
};
