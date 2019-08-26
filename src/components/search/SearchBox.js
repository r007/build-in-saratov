import React from 'react';
import { connectSearchBox } from 'react-instantsearch-dom';
import styled from 'styled-components';

const SearchForm = styled.form`
  position: relative;
  border-top: 2px solid #aad2ff;
  padding: 0.3rem 0 0 0;
  margin-top: 1em;

  input::placeholder {
    color: #aad2ff;
    opacity: 1;
  }
`;

const SearchLabel = styled.label`
  font-size: 0.7rem;
  letter-spacing: 0.05em;
  padding: 0;
  margin: 0.3rem 0;
  display: block;
`;

const SearchInput = styled.input`
  display: block;
  background: #aad2ff;
  color: #1a1f3e;
  border: none;
  position: relative;
  padding: 0 0.5em;
  font-size: 0.7em;
  letter-spacing: 0.03em;
  width: 80%;
  float: left;

  &:focus {
    background: #fff;
  }
`;

const Animated = styled.div`
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
`;

// Search button with magnifier icon styling
const SearchButton = styled.button`
  background: 0 0;
  border: none;
  right: 3px;
  position: absolute;

  div:first-child {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 3px solid #aad2ff;
  }

  &:hover div:first-child {
    width: 15px;
    height: 15px;
  }

  div:nth-child(2) {
    width: 15px;
    height: 3px;
    background: #aad2ff;
    transform: rotate(45deg) translate(8px, -8px);
  }

  &:hover div:nth-child(2) {
    width: 10px;
    transform: rotate(45deg) translate(11px, -12px);
  }
`;

export default connectSearchBox(({ currentRefinement, refine, ...rest }) => (
  <SearchForm noValidate action="" id="search" role="search">
    <SearchLabel className="search-label" htmlFor="search-input">
      Искать
    </SearchLabel>
    <SearchInput
      id="search-input"
      name="search-input"
      type="text"
      placeholder="Например, WordPress"
      aria-label="Искать"
      value={currentRefinement}
      onChange={e => refine(e.target.value)}
      {...rest}
    />
    <SearchButton
      onClick={event => {
        event.preventDefault();
        refine('');
      }}
      value="Начать новый поиск"
      title="Начать новый поиск"
    >
      <Animated />
      <Animated />
    </SearchButton>
  </SearchForm>
));
