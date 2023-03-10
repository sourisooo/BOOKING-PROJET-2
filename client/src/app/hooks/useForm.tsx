import React, { PropsWithChildren, ReactElement, useCallback, useState } from 'react';
import { validator, ValidatorConfigType } from '../utils/validator';

function useForm<T>(initialData: T, validateOnChange: boolean, validatorConfig: ValidatorConfigType) {
  const [data, setData] = useState<T>(initialData);
  const [errors, setErrors] = useState<{ [x: string]: string }>({});
  const [enterError, setEnterError] = useState<string | null>(null);

  const validate = useCallback(
    data => {
      const errors = validator(data, validatorConfig);
      setErrors(errors);
      return Object.keys(errors).length === 0;
    },
    [validatorConfig, setErrors]
  );

  const handleInputChange = useCallback(
    ({ target }) => {
      const { name, value } = target;
      setData(prevState => ({
        ...prevState,
        [name]: value,
      }));
      setEnterError(null);
      setErrors({});
      if (validateOnChange) validate({ [name]: value });
    },
    [validateOnChange, validate]
  );

  const handleKeyDown = useCallback(event => {
    if (event.keyCode === 13) {
      event.preventDefault();
      const form = event.target.form;
      const formElements = [...form.elements].filter(
        el => el.tagName.toLowerCase() === 'input' || el.tagName.toLowerCase() === 'button'
      );
      const indexField = Array.prototype.indexOf.call(formElements, event.target);
      formElements[indexField + 1].focus();
    }
  }, []);

  const handleResetForm = (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setData(initialData);
    setErrors({});
  };

  return {
    data,
    setData,
    errors,
    setErrors,
    enterError,
    setEnterError,
    handleInputChange,
    handleKeyDown,
    validate,
    handleResetForm,
  };
}

type FormType = {
  data: {
    [key: string]: any;
  };
  errors?: {
    [key: string]: any;
  };
  children?: React.ReactNode;
  handleKeyDown?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

type FormItemProps = {
  name: string;
  data?: {
    [key: string]: any;
  };
  value?: string;
  error?: string;
  type?: string;
  props?: {
    [key: string]: any;
  };
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function Form({ children, handleChange, data, errors, handleKeyDown, ...rest }: FormType) {
  const clonedElements = React.Children.map(children, child => {
    const item = child as ReactElement<PropsWithChildren<FormItemProps>>;
    const childType = typeof item;
    let config: FormItemProps = { name: '' };
    if (
      childType === 'object' ||
      (childType === 'function' && item.props.type !== 'submit' && item.props.type !== 'button')
    ) {
      config = {
        ...item.props,
        data: data,
        onChange: handleChange,
        value: data[item.props.name],
        error: errors?.[item.props.name],
        onKeyDown: handleKeyDown,
      };
    }
    return React.cloneElement(item, config);
  });

  return (
    <form className='form' {...rest}>
      {clonedElements}
    </form>
  );
}

export { useForm, Form };

//Commentaires
//La fonction useForm prend pour entr??e un objet de type non d??fini, un boolean et un ValidatorConfigType.
//La fonction sp??cifie plusieurs variables en leur associant la fonctionnalit?? useState de react.
//La fonction validate prend un objet data en entr??e la soumet ?? la fonction validor (g??re toutes
//les restriction de formes) , incr??ment l'objet data nouvellement modifi?? dans la variable error ?? travers
//la fonction SET de useState impl??ment??e react.
//La fonction handleInputChange prend un objet target, le destructure, utilise la fonction SET de data sur les
//les variables de target de tel mani??re ?? pouvoir constitu?? un array d'objet target; Cette fonction est
//lanc??e ?? chaque fois que validateOnChange, validate sont modifi??es (useCallback).
//La fonction handleKeyDown constitue un array de form (lui meme ??tant un target.form) puis de lui appliquer
//un filtre de tel mani??re ?? filter input ou button comme param??tre du filtre m??thode. L'index du formElements
//va etre retourner puis le formelement est incr??ment??e d'une unit?? puis focaliser l'entr??e de saisie clavier
//sur cet emplacement HTML de la page HTML. La fonction useForm retourne toutes les fonctions, variables et objets
//cit??s pr??c??demment.
//La fonction Form prend pour entr??e un objet de formType (d??finit juste avant mais non analyser dans le commentaire)
//puis navigue ?? travers l'un des param??tres de l'objet pris en entr??e pour retourner config (item modifi??). La fonction
//form va ensuite retourner l'un des param??tres de l'objet de type formtype ainsi que la config dans un template
//HTML.