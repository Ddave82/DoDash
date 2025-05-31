import React from 'react';
import styled from 'styled-components';

interface Props {
  color: string;
  onChange: (color: string) => void;
}

const ColorPickerContainer = styled.div`
  position: relative;
`;

const ColorButton = styled.button<{ color: string }>`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 2px solid #fff;
  background-color: ${props => props.color};
  cursor: pointer;
  padding: 0;
  overflow: hidden;
`;

const HiddenInput = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
`;

const ColorPicker: React.FC<Props> = ({ color, onChange }) => {
  return (
    <ColorPickerContainer>
      <ColorButton color={color}>
        <HiddenInput
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
        />
      </ColorButton>
    </ColorPickerContainer>
  );
};

export default ColorPicker;
