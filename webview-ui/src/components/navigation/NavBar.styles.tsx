import styled from 'styled-components';

export const NavContainer = styled.nav``;

export const NavContent = styled.div`
    max-width: 1200px;
    margin: 0 auto;
`;

export const NavWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

export const LogoContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    img {
        width: 20px;
        height: 20px;
        object-fit: contain;
        border: none;
        box-shadow: none;
    }

    @media (max-width: 600px) {
        span {
            display: none;
        }
    }
`;

export const LogoText = styled.span`
    color: #cccccc;
    font-size: 12px;
    font-weight: 400;
    letter-spacing: 0.2px;
`;

export const ButtonContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

interface NavButtonProps {
    $isActive?: boolean;
}

export const NavButton = styled.button<NavButtonProps>`
    padding: 6px 10px;
    border: none;
    background: ${props => props.$isActive ? '#2d2d2d' : 'transparent'};
    color: ${props => props.$isActive ? '#ffffff' : '#cccccc'};
    font-size: 11px;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.2s ease;
    display: flex;
    align-items: center;
    gap: 4px;

    &:hover {
        background: ${props => props.$isActive ? '#2d2d2d' : '#252525'};
        color: #ffffff;
    }

    &:focus {
        outline: none;
    }

    @media (max-width: 600px) {
        padding: 6px;
        
        span {
            display: none;
        }

        svg {
            margin: 0;
            width: 16px;
            height: 16px;
        }
    }
`;

export const ButtonIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    svg {
        width: 14px;
        height: 14px;
    }
`;