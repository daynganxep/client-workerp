import Title from "./Title";

function WrapPage({ title, Component, element }) {
    if (Component) {
        return <>
            <Title>{title}</Title>
            <Component />
        </>;
    }
    if (element) {
        return <>
            <Title>{title}</Title>
            {element}
        </>;
    }
    return <Title>{title}</Title>;
}

export default WrapPage;