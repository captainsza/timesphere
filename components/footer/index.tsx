// Footer.js

import React from 'react';
import styled from 'styled-components';

interface FooterProps {
  theme?: any;
}

const Footer: React.FC<FooterProps> = ({ theme }) => {
  return (
    <FooterWrapper>
      <FooterText>© 2024 Futuristic Clock App</FooterText>
    </FooterWrapper>
  );
};

const FooterWrapper = styled.footer`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
`;

const FooterText = styled.p`
  color: ${props => props.theme.text};
  font-size: 0.8rem;
  opacity: 0.7;
`;

export default Footer;
