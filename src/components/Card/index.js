import React, { useRef, useContext } from "react";
import { useDrag, useDrop } from "react-dnd";

import { Container, Label } from "./styles";

import BoardContext from "../Boad/context";

export default function Card({ data, index, listIndex }) {
  const ref = useRef();
  const { move } = useContext(BoardContext);

  const [{ isDragging }, dragRef] = useDrag({
    item: {
      type: "CARD",
      index,
      id: data.id,
      content: data.content,
      listIndex
    },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  });

  const [, dropRef] = useDrop({
    accept: "CARD",
    hover(item, monitor) {
      const draggedListIndex = item.listIndex;
      const targetListIndex = listIndex;

      const draggedIndex = item.index;
      const targetIndex = index;

      if (
        draggedIndex === targetIndex &&
        draggedListIndex === targetListIndex
      ) {
        return;
      }

      const targetSize = ref.current.getBoundingClientRect();
      const targetCenter = (targetSize.bottom - targetSize.top) / 2;

      const draggedOfset = monitor.getClientOffset();
      const draggedTop = draggedOfset.y - targetSize.top;

      /**
       * Verifica de estou tentando arastar um item que para o mesmo lugar que
       * se encontra atualmente. Antes do item.
       */
      if (draggedIndex < targetIndex && draggedTop < targetCenter) {
        return;
      }

      /**
       * Verifica de estou tentando arastar um item que para o mesmo lugar que
       * se encontra atualmente. Depois do item.
       */
      if (draggedIndex > targetIndex && draggedTop > targetCenter) {
        return;
      }

      move(draggedListIndex, targetListIndex, draggedIndex, targetIndex);

      item.index = targetIndex;
      item.listIndex = targetListIndex;
    }
  });

  dragRef(dropRef(ref));

  return (
    <Container ref={ref} isDragging={isDragging}>
      <header>
        {data.labels.map(label => (
          <Label key={label} color={label} />
        ))}
      </header>
      <p>{data.content}</p>
      {data.user && <img src={data.user} alt="Avatar" />}
    </Container>
  );
}
