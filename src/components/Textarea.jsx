import styled from 'styled-components';

const Textarea = styled.textarea`
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.25rem;
  letter-spacing: 0.16px;
  outline: 2px solid transparent;
  outline-offset: -2px;
  background-color: #f3f3f3;
  width: 100%;
  min-width: 10rem;
  min-height: 2.5rem;
  padding: 0.6875rem 1rem;
  color: #171717;
  order: 3;
  resize: vertical;
  border: none;
  border-bottom: 1px solid #8c8c8c;
  transition: 110ms all;
  box-sizing: border-box;

  :focus,
  :active {
    outline: 2px solid #164194;
    outline-offset: -2px;
  }

  &[aria-invalid='true'],
  &:invalid {
    /*border-color: #dc3545;*/
    outline: 2px solid #da1e28;
    outline-offset: -2px;
    padding-right: calc(1.5em + 0.75rem);
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='%23dc3545' viewBox='-2 -2 7 7'%3e%3cpath stroke='%23dc3545' d='M0 0l3 3m0-3L0 3'/%3e%3ccircle r='.5'/%3e%3ccircle cx='3' r='.5'/%3e%3ccircle cy='3' r='.5'/%3e%3ccircle cx='3' cy='3' r='.5'/%3e%3c/svg%3E");
    background-repeat: no-repeat;
    background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
    background-position: top calc(0.375em + 0.1875rem) right calc(0.375em + 0.1875rem);

    &:focus {
      box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
    }
  }
`;

export default Textarea;
