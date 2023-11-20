export interface DragItem {
   id: string;
   type: string;
}
const dragDrop = {
   onDragEnd: (result: { source: any; destination: any }, favoritePairs: Iterable<unknown> | ArrayLike<unknown>, setFavoritePairs: (arg0: unknown[]) => void, currencyPairs: Iterable<unknown> | ArrayLike<unknown>, setCurrencyPairs: (arg0: unknown[]) => void) => {
      const { source, destination } = result;
      if (!destination) {
         return;
      }
      if (source.droppableId === destination.droppableId) {
         const items = Array.from(source.droppableId === 'favorites' ? favoritePairs : currencyPairs);
         const [reorderedItem] = items.splice(source.index, 1);
         items.splice(destination.index, 0, reorderedItem);
         if (source.droppableId === 'favorites') {
            setFavoritePairs(items);
         } else {
            setCurrencyPairs(items);
         }
      } else {
         const sourceItems = Array.from(source.droppableId === 'favorites' ? favoritePairs : currencyPairs);
         const destItems = Array.from(destination.droppableId === 'favorites' ? favoritePairs : currencyPairs);
         const [removed] = sourceItems.splice(source.index, 1);
         if (destination.droppableId === 'favorites' && destItems.length < 4) {
            destItems.splice(destination.index, 0, removed);
            setFavoritePairs(destItems);
         }
         setCurrencyPairs(sourceItems);
      }
   },
};
export default dragDrop;
