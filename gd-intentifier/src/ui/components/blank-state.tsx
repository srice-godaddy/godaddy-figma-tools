import * as React from 'react';

interface IBlankStateProps {
    children: React.ReactNode;
}

export default function BlankState({ children }: IBlankStateProps) {
    return <div className="ui-blank-state">{children}</div>;
}
