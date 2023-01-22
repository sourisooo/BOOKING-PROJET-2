import { useCallback, useEffect, useState } from 'react';

function usePagination<T>(items: Array<T>, defaultPageSize?: number, defaultCurrentPage?: number) {
  const [currentPage, setCurrentPage] = useState(defaultCurrentPage || 1);
  const [pageSize, setPageSize] = useState(defaultPageSize || 5);

  useEffect(() => {
    if (items.length < pageSize) {
      setCurrentPage(1);
    }
  }, [items, pageSize]);

  const handleChangePage = useCallback((event, value) => {
    setCurrentPage(value);
  }, []);

  const handleChangePageSize = useCallback(event => {
    setPageSize(parseInt(event.target.value, 10));
    setCurrentPage(1);
  }, []);

  const itemsListCrop = items.slice((currentPage - 1) * pageSize, (currentPage - 1) * pageSize + pageSize);

  return { itemsListCrop, currentPage, pageSize, handleChangePage, handleChangePageSize } as const;
}

export default usePagination;

//Commentaires
//La fonction usePagination prend pour entrée un array de type non défini avec deux parammètres.
//La  fonction définit les variables currentPage et page size en utilisant les fonctionnalités react
//useState. Une fonction useEffect a été défini pour , de tel manière à ce que lorsque la longueur
//de l'array est inféreur à 5, currentPage à 1.
// La fonction handleChangePage est une fonction prenant pour entrée deux variable et applique
//la méthode SET implémenter react de useState sur la variable  currentPage en prenant pour
//argument l'une des variables prises en entrée de fonction.
// La fonction handleChangePageSize est fonction prenant pour entrée  un objet puis d'utiliser
//la fonction SET implémenter react de useState sur la variable PageSize en prenant pour
//arugment l'objet passé en entrée de fonction.
// La fonction usePagination retourne l'ensemble des fonctions précitées.
