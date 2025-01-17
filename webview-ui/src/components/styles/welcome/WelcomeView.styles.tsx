import styled, { keyframes } from "styled-components"

const gradientAnimation = keyframes`
    0% { background-position: 0% 50% }
    50% { background-position: 100% 50% }
    100% { background-position: 0% 50% }
`

const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
`

export const Container = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 60px;
    max-width: 900px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 32px;
    overflow-y: auto;
    animation: ${fadeIn} 0.6s ease-out;

    &::-webkit-scrollbar {
        width: 8px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
    }

    &::-webkit-scrollbar-thumb {
        background: var(--vscode-scrollbarSlider-background);
        border-radius: 4px;
        
        &:hover {
            background: var(--vscode-scrollbarSlider-hoverBackground);
        }
    }
`

export const Title = styled.h2`
    font-size: 3.5rem;
    font-weight: 700;
    margin: 0;
    background: linear-gradient(120deg, 
        var(--vscode-editor-foreground) 0%,
        var(--vscode-textLink-foreground) 45%,
        var(--vscode-editor-foreground) 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: ${gradientAnimation} 8s ease infinite;
    letter-spacing: -1px;
    line-height: 1.1;
`

export const Description = styled.p<{ delay?: number }>`
    font-size: 1.2rem;
    line-height: 1.7;
    margin: 0;
    color: var(--vscode-editor-foreground);
    opacity: 0.92;
    animation: ${fadeIn} 0.6s ease-out ${props => props.delay || 0}s both;
`

export const FeatureList = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin: 10px 0;
`

export const Feature = styled.div`
    padding: 16px 20px;
    background: var(--vscode-editor-background);
    border: 1px solid var(--vscode-widget-border);
    border-radius: 12px;
    transition: all 0.2s ease;
    animation: ${fadeIn} 0.6s ease-out 0.3s both;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        border-color: var(--vscode-textLink-foreground);
    }

    &::before {
        content: "•";
        color: var(--vscode-textLink-foreground);
        margin-right: 8px;
        font-size: 1.4em;
        vertical-align: middle;
    }
`

export const Highlight = styled.div`
    display: block;
    margin: 16px 0;
    font-size: 1.3rem;
    font-weight: 500;
    color: var(--vscode-editor-foreground);
    animation: ${fadeIn} 0.6s ease-out 0.4s both;
    padding: 24px;
    background: linear-gradient(
        120deg,
        var(--vscode-editor-background) 0%,
        var(--vscode-editor-background) 100%
    );
    border-radius: 12px;
    border: 1px solid var(--vscode-widget-border);
`

export const ButtonContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 12px;
    padding: 32px;
    background: var(--vscode-editor-background);
    border: 1px solid var(--vscode-widget-border);
    border-radius: 16px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    animation: ${fadeIn} 0.6s ease-out 0.5s both;
    transition: all 0.3s ease;

    &:hover {
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
        transform: translateY(-2px);
    }
`

export const StyledButton = styled.div`
    margin-top: 8px;
    display: flex;
    justify-content: center;
    
    vscode-button {
        width: 100%;
        max-width: 240px;
        height: 40px;
        transition: all 0.2s ease;

        &:not([disabled]):hover {
            transform: translateY(-1px);
        }
    }
` 