import React, { PropsWithChildren } from 'react';
import { Dev } from '../dev';
import { MainHeader } from './mainHeader';
import { Layout, Nav, Button, Space } from '@douyinfe/semi-ui';
import { AccountInfo } from '@/components/common/accountInfo';
import { GetToken } from './getToken';

const { Header, Footer, Sider, Content } = Layout;

interface Props {
	left: React.ReactNode;
	content: React.ReactNode;
}

export const TradeLayout: React.FC<PropsWithChildren<Props>> = ({
	children,
	left,
	content,
}) => {
	return (
		<>
			<Layout>
				<Header>
					<Nav
						mode="horizontal"
						footer={
							<Space spacing={20}>
								<GetToken />
								<AccountInfo />
							</Space>
						}
						style={{ height: '48px' }}
					>
						<Nav.Header>
							<div className="flex flex-row gap-1 items-center text-gray-500">
								{/* <span>Orderly SDK</span> */}
								<div className="rounded overflow-hidden">
									<img
										style={{ height: '36px' }}
										src="https://www.gitbook.com/cdn-cgi/image/width=40,dpr=2,height=40,fit=contain,format=auto/https%3A%2F%2F1405416796-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FHLMZIGVR3rR3JNsj0vCF%252Ficon%252F19XW93iMrrl7KSI7qhCY%252FOrderly%2520Network_Brandmark_Gradient.jpg%3Falt%3Dmedia%26token%3De49bd955-54f6-4357-8f25-d17b258100e7"
										alt=""
									/>
								</div>

								<span className="text-xs ">{`Orderly SDK 1.1.1 / ${
									(window as any).___webpackCompilationHash ?? '-'
								}`}</span>
							</div>
						</Nav.Header>
					</Nav>
				</Header>
				<Layout>
					<Content>{content}</Content>
					<Sider style={{ width: '320px' }}>{left}</Sider>
				</Layout>
			</Layout>
			{children}
		</>
	);
};
