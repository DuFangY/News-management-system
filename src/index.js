import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd'
import {store,persistor} from './redux/store';
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux';
import zhCN from 'antd/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import App from './App';
import './index.css'
import './util/http'


dayjs.locale('zh-cn');
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <ConfigProvider locale={zhCN}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </ConfigProvider>
        </PersistGate>
    </Provider>

);

