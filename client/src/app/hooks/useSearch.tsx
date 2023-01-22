import { useEffect, useState } from 'react';
import useDebounce from './useDebounce';

export default function useSearch<T>(data: Array<T>, config: { searchBy: string }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setData] = useState(data || []);
  const [isSearching, setIsSearching] = useState(false);

  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      setIsSearching(true);
      const dataFiltered = data.filter((item: any) =>
        item[config.searchBy].toString().toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
      setData(dataFiltered);
      setIsSearching(false);
    } else {
      setData(data);
      setIsSearching(false);
    }
  }, [debouncedSearchTerm, data]);

  return { filteredData, isSearching, searchTerm, setSearchTerm, handleChangeSearch };
}

//Commentaires
//La fonction useSearch est un array de type non défini et est constitué des deux paramètres:
//data (constituant l'array) et config (string). La fonction handleChangeSearch prend pour entrée un
//un type changeEvent.HTMLInputElement danslequel la valeur de saisie est affectée à la valeur searchTerm
// à travers la méthode SET de la fonctionnalité react useState. 
//La fonctionnalité react useDebounce permet de fixer un intervalle entre chaque utilisation de fonction.
// La fonctionnalité useEffet est utilisé lorsque l'array data (intrant de la fonction useSearch) et la fonction 
// searchTerm est modifié. UseEffet réalise, dans ce cas, un filtre est réalisé sur l'array data (intrant de la fonction useSearch)
//, le filtre est réalisé de manière à etre effectuer sur searchterm.
// La fonction retourne les fonctions principalements cités précédemment.