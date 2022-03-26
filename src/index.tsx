import ReactDOM from 'react-dom';
import * as buffer from 'buffer';
import { App } from './App';

(window as any).Buffer = buffer.Buffer;
ReactDOM.render(<App />, document.getElementById('root'));
