import { useState } from 'react';

type Order = 'asc' | 'desc';

export default function useSort<T>(items: T[], initialSortBy: { path: keyof T; order: Order }) {
  const [sortBy, setSortBy] = useState(initialSortBy || {});

  function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(order: Order, orderBy: keyof T) {
    return order === 'desc'
      ? (a: T, b: T) => descendingComparator(a, b, orderBy)
      : (a: T, b: T) => -descendingComparator(a, b, orderBy);
  }

  function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
  }

  const handleRequestSort = (event: Event | React.MouseEvent<unknown>, property: keyof T) => {
    const isAsc = sortBy.path === property && sortBy.order === 'asc';
    setSortBy({ path: property, order: isAsc ? 'desc' : 'asc' });
  };

  const sortedItems = stableSort(items, getComparator(sortBy.order, sortBy.path));

  return { sortedItems, sortBy, setSortBy, handleRequestSort };
}

//Commentaires
//La fonction useSort est un array non définis prenant pour paramètre un objet "initialSortBy".
//La fonction descendingComparator est un array qui prend pour paramètre deux string et un paramètre
//qui retourne la clée d'un objet et réalise, à travers la comparaison des clées d'un objet, comparatif
//des 2 éléments. La fonction getComparator est une fonction prenant deux objets en entrée puis
//puis leur applique la fontion getComparator.
//La fonction stableSort prend pour entrée de fonction un array en lecture prenant pour paramètre une fonction qui elle meme
//prend deux objet en entrée et retourne un objet "number". La fonction stableSort permet de parcourir les listes
//el et index puis compare les valeurs a et b puis réaffecte l'index de la liste el.
//La fonction handleRequestSort prend pour entrée de type event ou mouse event et d'une variable de type keyof puis
// la fonction setSortBy est appelé en prenant pour paramètre d'entrée la variable de type keyof.
//La fonction useSort retourne les principales fonctions définies précédemment.

