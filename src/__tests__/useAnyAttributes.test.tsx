import React, { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { useAnyAttributes } from '../index';
import { asObject } from '../index';

describe('useAnyAttributes', () => {
    test('applies attributes to the ref-attached node', () => {
        function Demo() {
            const ref = useAnyAttributes<HTMLDivElement>({ foo: 'bar', obj: asObject({ a: 1 }) });
            return <div id="hookDiv" ref={ref} />;
        }
        render(<Demo />);
        const div = document.getElementById('hookDiv') as HTMLDivElement;
        expect(div.getAttribute('foo')).toBe('bar');
        // @ts-ignore
        expect(div.obj).toEqual({ a: 1 });
    });

    test('reactively updates and removes stale attributes when the map changes', async () => {
        const user = userEvent.setup();
        function Demo() {
            const [attrs, setAttrs] = useState<Record<string, any>>({ status: 'idle' });
            const ref = useAnyAttributes<HTMLDivElement>(attrs);
            return (
                <>
                    <button onClick={() => setAttrs({ status: 'active' })}>update</button>
                    <div id="hookReactiveDiv" ref={ref} />
                </>
            );
        }
        render(<Demo />);
        const div = document.getElementById('hookReactiveDiv') as HTMLDivElement;
        expect(div.getAttribute('status')).toBe('idle');

        await user.click(screen.getByText('update'));
        expect(div.getAttribute('status')).toBe('active');
    });

    test('does not throw when the node unmounts', () => {
        function Demo() {
            const [mounted, setMounted] = useState(true);
            const ref = useAnyAttributes<HTMLDivElement>({ foo: 'bar' });
            return (
                <>
                    <button onClick={() => setMounted(false)}>unmount</button>
                    {mounted && <div id="hookUnmountDiv" ref={ref} />}
                </>
            );
        }
        const { getByText } = render(<Demo />);
        expect(() => getByText('unmount').click()).not.toThrow();
    });

    test('defaults to an empty attribute map when none is given', () => {
        function Demo() {
            const ref = useAnyAttributes<HTMLDivElement>();
            return <div id="hookDefaultDiv" ref={ref} />;
        }
        expect(() => render(<Demo />)).not.toThrow();
    });
});
