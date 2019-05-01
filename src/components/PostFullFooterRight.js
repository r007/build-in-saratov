import * as _ from 'lodash';
import * as React from 'react';
import styled from 'styled-components';

import Button from './Button';

const PostFullFooterRightDiv = styled.div`
  flex-shrink: 0;
  margin-left: 20px;
`;

const PostFullFooterRight = ({ authorId }) => {
  return (
    <PostFullFooterRightDiv>
      <Button rounded color="transparent" href={`/author/${_.kebabCase(authorId)}/`}>
        Все записи автора
      </Button>
    </PostFullFooterRightDiv>
  );
};

export default PostFullFooterRight;
