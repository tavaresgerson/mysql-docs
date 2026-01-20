export default [
	{
		text: 'Prefácio e Avisos Legais',
		link: '/01-preface-and-legal-notices.md',
	},
	{
		text: 'Capítulo 1 Informações Gerais',
		collapsed: true,
		items: [
			{
				text: '1.1 Sobre este manual',
				link: '/02-general-information/01-about-this-manual.md',
			},
			{
				text: '1.3 O que há de novo no MySQL 5.7',
				link: '/02-general-information/03-what-is-new-in-mysql-57.md',
			},
			{
				text: '1.4 Variáveis e opções de servidor e status adicionadas, descontinuadas ou removidas no MySQL 5.7',
				link: '/02-general-information/04-server-and-status-variables.md',
			},
			{
				text: '1.5 Como relatar bugs ou problemas',
				link: '/02-general-information/05-how-to-report-bugs-or-problems.md',
			},
			{
				text: '1.2 Visão geral do sistema de gerenciamento de banco de dados MySQL',
				collapsed: true,
				items: [
					{
						text: '1.2.1 O que é o MySQL?',
						link: '/02-general-information/02-overview-of-the-mysql-database-management-system/01-what-is-my-sql.md',
					},
					{
						text: '1.2.2 Principais características do MySQL',
						link: '/02-general-information/02-overview-of-the-mysql-database-management-system/02-the-main-features-of-my-sql.md',
					},
					{
						text: '1.2.3 História do MySQL',
						link: '/02-general-information/02-overview-of-the-mysql-database-management-system/03-history-of-my-sql.md',
					},
				],
				link: '/02-general-information/02-overview-of-the-mysql-database-management-system/index.md',
			},
			{
				text: '1.6 Conformidade com os Padrões MySQL',
				collapsed: true,
				items: [
					{
						text: '1.6.1 Extensões do MySQL para SQL Padrão',
						link: '/02-general-information/06-mysql-standards-compliance/01-mysql-extensions-to-standard-sql.md',
					},
					{
						text: '1.6.2 Diferenças do MySQL em relação ao SQL Padrão',
						collapsed: true,
						items: [
							{
								text: '1.6.2.1 Selecionar para tabela Diferenças',
								link: '/02-general-information/06-mysql-standards-compliance/02-mysql-differences-from-standard-sql/01-selectintotable-differences.md',
							},
							{
								text: '1.6.2.2 Diferenças do UPDATE',
								link: '/02-general-information/06-mysql-standards-compliance/02-mysql-differences-from-standard-sql/02-update-differences.md',
							},
							{
								text: '1.6.2.3 Diferenças entre a restrição de chave estrangeira',
								link: '/02-general-information/06-mysql-standards-compliance/02-mysql-differences-from-standard-sql/03-foreignkey-constraint-differences.md',
							},
							{
								text: '1.6.2.4 \'--\' como início de um comentário',
								link: '/02-general-information/06-mysql-standards-compliance/02-mysql-differences-from-standard-sql/04-as-the-start-of-a-comment.md',
							},
						],
						link: '/02-general-information/06-mysql-standards-compliance/02-mysql-differences-from-standard-sql/index.md',
					},
					{
						text: '1.6.3 Como o MySQL lida com restrições',
						collapsed: true,
						items: [
							{
								text: '1.6.3.1 Restrições de índice de chave primária e índice único',
								link: '/02-general-information/06-mysql-standards-compliance/03-how-mysql-deals-with-constraints/01-primary-key-and-unique-index-constraints.md',
							},
							{
								text: '1.6.3.2 Restrições de Chave Estrangeira',
								link: '/02-general-information/06-mysql-standards-compliance/03-how-mysql-deals-with-constraints/02-foreignkey-constraints.md',
							},
							{
								text: '1.6.3.3 Restrições para dados inválidos',
								link: '/02-general-information/06-mysql-standards-compliance/03-how-mysql-deals-with-constraints/03-constraints-on-invalid-data.md',
							},
							{
								text: '1.6.3.4 Restrições de ENUM e SET',
								link: '/02-general-information/06-mysql-standards-compliance/03-how-mysql-deals-with-constraints/04-enum-and-set-constraints.md',
							},
						],
						link: '/02-general-information/06-mysql-standards-compliance/03-how-mysql-deals-with-constraints/index.md',
					},
				],
				link: '/02-general-information/06-mysql-standards-compliance/index.md',
			},
		],
		link: '/02-general-information/index.md',
	},
	{
		text: 'Capítulo 2: Instalação e Atualização do MySQL',
		collapsed: true,
		items: [
			{
				text: '2.2 Instalar o MySQL no Unix/Linux usando binários genéricos',
				link: '/03-installing-and-upgrading-my-sql/02-installing-mysql-on-unix-linux-using-generic-binaries.md',
			},
			{
				text: '2.6 Instalação do MySQL usando Unbreakable Linux Network (ULN)',
				link: '/03-installing-and-upgrading-my-sql/06-installing-mysql-using-unbreakable-linux-network-uln.md',
			},
			{
				text: '2.1 Orientações Gerais de Instalação',
				collapsed: true,
				items: [
					{
						text: '2.1.1 Plataformas suportadas',
						link: '/03-installing-and-upgrading-my-sql/01-general-installation-guidance/01-supported-platforms.md',
					},
					{
						text: '2.1.2 Qual versão e distribuição do MySQL para instalar',
						link: '/03-installing-and-upgrading-my-sql/01-general-installation-guidance/02-which-mysql-version-and-distribution.md',
					},
					{
						text: '2.1.3 Como obter o MySQL',
						link: '/03-installing-and-upgrading-my-sql/01-general-installation-guidance/03-how-to-get-my-sql.md',
					},
					{
						text: '2.1.5 Planos de instalação',
						link: '/03-installing-and-upgrading-my-sql/01-general-installation-guidance/05-installation-layouts.md',
					},
					{
						text: '2.1.6 Características de compilação específicas do compilador',
						link: '/03-installing-and-upgrading-my-sql/01-general-installation-guidance/06-compiler-specific-build-characteristics.md',
					},
					{
						text: '2.1.4 Verificar a integridade do pacote usando verificações MD5 ou GnuPG',
						collapsed: true,
						items: [
							{
								text: '2.1.4.1 Verificar o checksum MD5',
								link: '/03-installing-and-upgrading-my-sql/01-general-installation-guidance/04-verifying-package-integrity/01-verifying-the-md5-checksum.md',
							},
							{
								text: '2.1.4.2 Verificação de assinatura usando o GnuPG',
								link: '/03-installing-and-upgrading-my-sql/01-general-installation-guidance/04-verifying-package-integrity/02-signature-checking-using-gnu-pg.md',
							},
							{
								text: '2.1.4.3 Verificação de assinatura usando o Gpg4win para Windows',
								link: '/03-installing-and-upgrading-my-sql/01-general-installation-guidance/04-verifying-package-integrity/03-signature-checking-using-gpg4.md',
							},
							{
								text: '2.1.4.4 Verificação de assinatura usando RPM',
								link: '/03-installing-and-upgrading-my-sql/01-general-installation-guidance/04-verifying-package-integrity/04-signature-checking-using-rpm.md',
							},
							{
								text: '2.1.4.5 Chave de Construção Pública GPG para Pacotes Arquivados',
								link: '/03-installing-and-upgrading-my-sql/01-general-installation-guidance/04-verifying-package-integrity/05-gpg-public-build-key-for-archived-packages.md',
							},
						],
						link: '/03-installing-and-upgrading-my-sql/01-general-installation-guidance/04-verifying-package-integrity/index.md',
					},
				],
				link: '/03-installing-and-upgrading-my-sql/01-general-installation-guidance/index.md',
			},
			{
				text: '2.3 Instalação do MySQL no Microsoft Windows',
				collapsed: true,
				items: [
					{
						text: '2.3.1 Estrutura de instalação do MySQL no Microsoft Windows',
						link: '/03-installing-and-upgrading-my-sql/03-installing-my-sql-on-microsoft-windows/01-mysql-installation-layout-on-microsoft-windows.md',
					},
					{
						text: '2.3.2 Escolhendo um pacote de instalação',
						link: '/03-installing-and-upgrading-my-sql/03-installing-my-sql-on-microsoft-windows/02-choosing-an-installation-package.md',
					},
					{
						text: '2.3.5 Solução de problemas de instalação do Microsoft Windows MySQL Server',
						link: '/03-installing-and-upgrading-my-sql/03-installing-my-sql-on-microsoft-windows/05-troubleshooting-a-microsoft-windows.md',
					},
					{
						text: '2.3.6 Procedimentos pós-instalação do Windows',
						link: '/03-installing-and-upgrading-my-sql/03-installing-my-sql-on-microsoft-windows/06-windows-postinstallation-procedures.md',
					},
					{
						text: '2.3.7 Restrições da Plataforma Windows',
						link: '/03-installing-and-upgrading-my-sql/03-installing-my-sql-on-microsoft-windows/07-windows-platform-restrictions.md',
					},
					{
						text: '2.3.3 Instalador do MySQL para Windows',
						collapsed: true,
						items: [
							{
								text: '2.3.3.1 Configuração inicial do instalador do MySQL',
								link: '/03-installing-and-upgrading-my-sql/03-installing-my-sql-on-microsoft-windows/03-mysql-installer-for-windows/01-my-sql-installer-initial-setup.md',
							},
							{
								text: '2.3.3.2 Configurando caminhos alternativos de servidor com o instalador do MySQL',
								link: '/03-installing-and-upgrading-my-sql/03-installing-my-sql-on-microsoft-windows/03-mysql-installer-for-windows/02-setting-alternative-server-paths.md',
							},
							{
								text: '2.3.3.3 Fluxos de trabalho de instalação com o Instalador MySQL',
								link: '/03-installing-and-upgrading-my-sql/03-installing-my-sql-on-microsoft-windows/03-mysql-installer-for-windows/03-installation-workflows.md',
							},
							{
								text: '2.3.3.4 Catálogo de produtos e painel de controle do instalador MySQL',
								link: '/03-installing-and-upgrading-my-sql/03-installing-my-sql-on-microsoft-windows/03-mysql-installer-for-windows/04-my-sql-installer-product-catalog-and-dashboard.md',
							},
							{
								text: '2.3.3.5 Referência do Console do Instalador do MySQL',
								link: '/03-installing-and-upgrading-my-sql/03-installing-my-sql-on-microsoft-windows/03-mysql-installer-for-windows/05-my-sql-installer-console-reference.md',
							},
						],
						link: '/03-installing-and-upgrading-my-sql/03-installing-my-sql-on-microsoft-windows/03-mysql-installer-for-windows/index.md',
					},
					{
						text: '2.3.4 Instalando o MySQL no Microsoft Windows usando um arquivo ZIP `noinstall`',
						collapsed: true,
						items: [
							{
								text: '2.3.4.1 Extrair o arquivo de instalação',
								link: '/03-installing-and-upgrading-my-sql/03-installing-my-sql-on-microsoft-windows/04-installing-mysql-on-microsoft/01-extracting-the-install-archive.md',
							},
							{
								text: '2.3.4.2 Criando um arquivo de opção',
								link: '/03-installing-and-upgrading-my-sql/03-installing-my-sql-on-microsoft-windows/04-installing-mysql-on-microsoft/02-creating-an-option-file.md',
							},
							{
								text: '2.3.4.3 Selecionando um tipo de servidor MySQL',
								link: '/03-installing-and-upgrading-my-sql/03-installing-my-sql-on-microsoft-windows/04-installing-mysql-on-microsoft/03-selecting-a-my-s-q-l-server-type.md',
							},
							{
								text: '2.3.4.4 Inicializando o Diretório de Dados',
								link: '/03-installing-and-upgrading-my-sql/03-installing-my-sql-on-microsoft-windows/04-installing-mysql-on-microsoft/04-initializing-the-data-directory.md',
							},
							{
								text: '2.3.4.5 Começando o servidor pela primeira vez',
								link: '/03-installing-and-upgrading-my-sql/03-installing-my-sql-on-microsoft-windows/04-installing-mysql-on-microsoft/05-starting-the-server-for-the-first-time.md',
							},
							{
								text: '2.3.4.6 Começando o MySQL a partir da linha de comando do Windows',
								link: '/03-installing-and-upgrading-my-sql/03-installing-my-sql-on-microsoft-windows/04-installing-mysql-on-microsoft/06-starting-my-s-q-l-from-the-windows-command-line.md',
							},
							{
								text: '2.3.4.7 Personalizar o caminho para as ferramentas do MySQL',
								link: '/03-installing-and-upgrading-my-sql/03-installing-my-sql-on-microsoft-windows/04-installing-mysql-on-microsoft/07-customizing-the-p-a-t-h-for-my-s-q-l-tools.md',
							},
							{
								text: '2.3.4.8 Começar o MySQL como um serviço do Windows',
								link: '/03-installing-and-upgrading-my-sql/03-installing-my-sql-on-microsoft-windows/04-installing-mysql-on-microsoft/08-starting-my-s-q-l-as-a-windows-service.md',
							},
							{
								text: '2.3.4.9 Testando a Instalação do MySQL',
								link: '/03-installing-and-upgrading-my-sql/03-installing-my-sql-on-microsoft-windows/04-installing-mysql-on-microsoft/09-testing-the-my-s-q-l-installation.md',
							},
						],
						link: '/03-installing-and-upgrading-my-sql/03-installing-my-sql-on-microsoft-windows/04-installing-mysql-on-microsoft/index.md',
					},
				],
				link: '/03-installing-and-upgrading-my-sql/03-installing-my-sql-on-microsoft-windows/index.md',
			},
			{
				text: '2.4 Instalando o MySQL no macOS',
				collapsed: true,
				items: [
					{
						text: '2.4.1 Notas gerais sobre a instalação do MySQL no macOS',
						link: '/03-installing-and-upgrading-my-sql/04-installing-my-sql-on-mac-os/01-general-notes-on-installing.md',
					},
					{
						text: '2.4.2 Instalando o MySQL no macOS usando pacotes nativos',
						link: '/03-installing-and-upgrading-my-sql/04-installing-my-sql-on-mac-os/02-installing-mysql-on-mac-os-using-native-packages.md',
					},
					{
						text: '2.4.3 Instalação do Daemon de Inicialização do MySQL',
						link: '/03-installing-and-upgrading-my-sql/04-installing-my-sql-on-mac-os/03-installing-a-mysql-launch-daemon.md',
					},
					{
						text: '2.4.4 Instalando e usando o painel de preferências do MySQL',
						link: '/03-installing-and-upgrading-my-sql/04-installing-my-sql-on-mac-os/04-installing-and-using-the-mysql-preference-pane.md',
					},
				],
				link: '/03-installing-and-upgrading-my-sql/04-installing-my-sql-on-mac-os/index.md',
			},
			{
				text: '2.5 Instalar o MySQL no Linux',
				collapsed: true,
				items: [
					{
						text: '2.5.1 Instalar o MySQL no Linux usando o repositório Yum do MySQL',
						link: '/03-installing-and-upgrading-my-sql/05-installing-mysql-on-linux/01-installing-mysql-on-linux-using-the-mysql-yum-repository.md',
					},
					{
						text: '2.5.2 Substituindo uma Distribuição de Terceiros do MySQL Usando o Repositório Yum do MySQL',
						link: '/03-installing-and-upgrading-my-sql/05-installing-mysql-on-linux/02-replacing-a-third-party-distribution.md',
					},
					{
						text: '2.5.3 Instalar o MySQL no Linux usando o repositório APT do MySQL',
						link: '/03-installing-and-upgrading-my-sql/05-installing-mysql-on-linux/03-installing-mysql-on-linux-using-the-mysql-apt-repository.md',
					},
					{
						text: '2.5.4 Instalando o MySQL no Linux usando o repositório MySQL SLES',
						link: '/03-installing-and-upgrading-my-sql/05-installing-mysql-on-linux/04-installing-mysql-on-linux-using-the-mysql-s-l-e-s-repository.md',
					},
					{
						text: '2.5.5 Instalar o MySQL no Linux usando pacotes RPM da Oracle',
						link: '/03-installing-and-upgrading-my-sql/05-installing-mysql-on-linux/05-installing-my-s-q-l-on-linux-using-r-p-m-packages-from-oracle.md',
					},
					{
						text: '2.5.6 Instalar o MySQL no Linux usando pacotes do Debian da Oracle',
						link: '/03-installing-and-upgrading-my-sql/05-installing-mysql-on-linux/06-installing-my-s-q-l-on-linux-using-debian-packages-from-oracle.md',
					},
					{
						text: '2.5.8 Instalando o MySQL no Linux a partir dos repositórios de software nativo',
						link: '/03-installing-and-upgrading-my-sql/05-installing-mysql-on-linux/08-installing-my-s-q-l-on-linux-from-the-native-software-repositories.md',
					},
					{
						text: '2.5.9 Instalando o MySQL no Linux com o Juju',
						link: '/03-installing-and-upgrading-my-sql/05-installing-mysql-on-linux/09-installing-my-s-q-l-on-linux-with-juju.md',
					},
					{
						text: '2.5.10 Gerenciando o servidor MySQL com o systemd',
						link: '/03-installing-and-upgrading-my-sql/05-installing-mysql-on-linux/10-managing-my-s-q-l-server-with-systemd.md',
					},
					{
						text: '2.5.7 Implantação do MySQL no Linux com Docker',
						collapsed: true,
						items: [
							{
								text: '2.5.7.1 Passos básicos para a implantação do servidor MySQL com o Docker',
								link: '/03-installing-and-upgrading-my-sql/05-installing-mysql-on-linux/07-deploying-mysql-on-linux-with-docker/01-basic-steps-for-my-s-q-l-server-deployment-with-docker.md',
							},
							{
								text: '2.5.7.2 Mais tópicos sobre implantação do servidor MySQL com Docker',
								link: '/03-installing-and-upgrading-my-sql/05-installing-mysql-on-linux/07-deploying-mysql-on-linux-with-docker/02-more-topics-on-deploying-my-s-q-l-server-with-docker.md',
							},
							{
								text: '2.5.7.3. Implantação do MySQL no Windows e em outras plataformas não Linux com o Docker',
								link: '/03-installing-and-upgrading-my-sql/05-installing-mysql-on-linux/07-deploying-mysql-on-linux-with-docker/03-deploying-my-s-q-l-on-windows-and-other-non-linux-platforms-with-docker.md',
							},
						],
						link: '/03-installing-and-upgrading-my-sql/05-installing-mysql-on-linux/07-deploying-mysql-on-linux-with-docker/index.md',
					},
				],
				link: '/03-installing-and-upgrading-my-sql/05-installing-mysql-on-linux/index.md',
			},
			{
				text: '2.7 Instalando o MySQL no Solaris',
				collapsed: true,
				items: [
					{
						text: '2.7.1 Instalar o MySQL no Solaris usando um PKG do Solaris',
						link: '/03-installing-and-upgrading-my-sql/07-installing-mysql-on-solaris/01-installing-my-s-q-l-on-solaris-using-a-solaris-pkg.md',
					},
				],
				link: '/03-installing-and-upgrading-my-sql/07-installing-mysql-on-solaris/index.md',
			},
			{
				text: '2.8 Instalando o MySQL a partir da fonte',
				collapsed: true,
				items: [
					{
						text: '2.8.1 Métodos de instalação da fonte',
						link: '/03-installing-and-upgrading-my-sql/08-installing-mysql-from-source/01-source-installation-methods.md',
					},
					{
						text: '2.8.2 Requisitos de instalação da fonte',
						link: '/03-installing-and-upgrading-my-sql/08-installing-mysql-from-source/02-source-installation-prerequisites.md',
					},
					{
						text: '2.8.3 Layout do MySQL para Instalação de Fonte',
						link: '/03-installing-and-upgrading-my-sql/08-installing-mysql-from-source/03-my-s-q-l-layout-for-source-installation.md',
					},
					{
						text: '2.8.4 Instalação do MySQL usando uma distribuição de fonte padrão',
						link: '/03-installing-and-upgrading-my-sql/08-installing-mysql-from-source/04-installing-my-s-q-l-using-a-standard-source-distribution.md',
					},
					{
						text: '2.8.5 Instalação do MySQL usando uma árvore de fonte de desenvolvimento',
						link: '/03-installing-and-upgrading-my-sql/08-installing-mysql-from-source/05-installing-my-s-q-l-using-a-development-source-tree.md',
					},
					{
						text: '2.8.6 Configurando Suporte à Biblioteca SSL',
						link: '/03-installing-and-upgrading-my-sql/08-installing-mysql-from-source/06-configuring-s-s-l-library-support.md',
					},
					{
						text: '2.8.7 Opções de configuração de fonte do MySQL',
						link: '/03-installing-and-upgrading-my-sql/08-installing-mysql-from-source/07-my-s-q-l-source-configuration-options.md',
					},
					{
						text: '2.8.8 Lidando com problemas de compilação do MySQL',
						link: '/03-installing-and-upgrading-my-sql/08-installing-mysql-from-source/08-dealing-with-problems-compiling-my-sql.md',
					},
					{
						text: '2.8.9 Configuração do MySQL e Ferramentas de Terceiros',
						link: '/03-installing-and-upgrading-my-sql/08-installing-mysql-from-source/09-my-s-q-l-configuration-and-third-party-tools.md',
					},
				],
				link: '/03-installing-and-upgrading-my-sql/08-installing-mysql-from-source/index.md',
			},
			{
				text: '2.9 Configuração e teste pós-instalação',
				collapsed: true,
				items: [
					{
						text: '2.9.1 Inicializando o Diretório de Dados',
						link: '/03-installing-and-upgrading-my-sql/09-postinstallation-setup-and-testing/01-initializing-the-data-directory.md',
					},
					{
						text: '2.9.3 Testando o servidor',
						link: '/03-installing-and-upgrading-my-sql/09-postinstallation-setup-and-testing/03-testing-the-server.md',
					},
					{
						text: '2.9.4 Segurança da conta inicial do MySQL',
						link: '/03-installing-and-upgrading-my-sql/09-postinstallation-setup-and-testing/04-securing-the-initial-my-s-q-l-account.md',
					},
					{
						text: '2.9.5 Iniciar e parar o MySQL automaticamente',
						link: '/03-installing-and-upgrading-my-sql/09-postinstallation-setup-and-testing/05-starting-and-stopping-my-s-q-l-automatically.md',
					},
					{
						text: '2.9.2 Começando o servidor',
						collapsed: true,
						items: [
							{
								text: '2.9.2.1 Solução de problemas para iniciar o servidor MySQL',
								link: '/03-installing-and-upgrading-my-sql/09-postinstallation-setup-and-testing/02-starting-the-server/01-troubleshooting-problems-starting-the-my-s-q-l-server.md',
							},
						],
						link: '/03-installing-and-upgrading-my-sql/09-postinstallation-setup-and-testing/02-starting-the-server/index.md',
					},
				],
				link: '/03-installing-and-upgrading-my-sql/09-postinstallation-setup-and-testing/index.md',
			},
			{
				text: '2.10 Atualização do MySQL',
				collapsed: true,
				items: [
					{
						text: '2.10.1 Antes de começar',
						link: '/03-installing-and-upgrading-my-sql/10-upgrading-my-sql/01-before-you-begin.md',
					},
					{
						text: '2.10.2 Caminhos de atualização',
						link: '/03-installing-and-upgrading-my-sql/10-upgrading-my-sql/02-upgrade-paths.md',
					},
					{
						text: '2.10.3 Alterações no MySQL 5.7',
						link: '/03-installing-and-upgrading-my-sql/10-upgrading-my-sql/03-changes-in-my-s-q-l-5-7.md',
					},
					{
						text: '2.10.4 Atualização de instalações binárias ou baseadas em pacotes do MySQL no Unix/Linux',
						link: '/03-installing-and-upgrading-my-sql/10-upgrading-my-sql/04-upgrading-my-s-q-l-binary-or-package-based-installations-on-unix-linux.md',
					},
					{
						text: '2.10.5 Atualizando o MySQL com o Repositório Yum do MySQL',
						link: '/03-installing-and-upgrading-my-sql/10-upgrading-my-sql/05-upgrading-my-s-q-l-with-the-my-s-q-l-yum-repository.md',
					},
					{
						text: '2.10.6 Atualizando o MySQL com o Repositório MySQL APT',
						link: '/03-installing-and-upgrading-my-sql/10-upgrading-my-sql/06-upgrading-my-s-q-l-with-the-my-s-q-l-a-p-t-repository.md',
					},
					{
						text: '2.10.7 Atualização do MySQL com o Repositório MySQL SLES',
						link: '/03-installing-and-upgrading-my-sql/10-upgrading-my-sql/07-upgrading-my-s-q-l-with-the-my-s-q-l-s-l-e-s-repository.md',
					},
					{
						text: '2.10.8 Atualização do MySQL no Windows',
						link: '/03-installing-and-upgrading-my-sql/10-upgrading-my-sql/08-upgrading-my-s-q-l-on-windows.md',
					},
					{
						text: '2.10.9 Atualizando uma Instalação Docker do MySQL',
						link: '/03-installing-and-upgrading-my-sql/10-upgrading-my-sql/09-upgrading-a-docker-installation-of-my-sql.md',
					},
					{
						text: '2.10.10 Atualizando o MySQL com pacotes RPM baixados diretamente',
						link: '/03-installing-and-upgrading-my-sql/10-upgrading-my-sql/10-upgrading-my-s-q-l-with-directly-downloaded-r-p-m-packages.md',
					},
					{
						text: '2.10.11 Solução de problemas de atualização',
						link: '/03-installing-and-upgrading-my-sql/10-upgrading-my-sql/11-upgrade-troubleshooting.md',
					},
					{
						text: '2.10.12 Reestruturação ou reparo de tabelas ou índices',
						link: '/03-installing-and-upgrading-my-sql/10-upgrading-my-sql/12-rebuilding-or-repairing-tables-or-indexes.md',
					},
					{
						text: '2.10.13 Copiar bancos de dados MySQL para outra máquina',
						link: '/03-installing-and-upgrading-my-sql/10-upgrading-my-sql/13-copying-my-s-q-l-databases-to-another-machine.md',
					},
				],
				link: '/03-installing-and-upgrading-my-sql/10-upgrading-my-sql/index.md',
			},
			{
				text: '2.11 Desatualização do MySQL',
				collapsed: true,
				items: [
					{
						text: '2.11.1 Antes de começar',
						link: '/03-installing-and-upgrading-my-sql/11-downgrading-my-sql/01-before-you-begin.md',
					},
					{
						text: '2.11.2 Caminhos de Downgrade',
						link: '/03-installing-and-upgrading-my-sql/11-downgrading-my-sql/02-downgrade-paths.md',
					},
					{
						text: '2.11.3 Notas de Downgrade',
						link: '/03-installing-and-upgrading-my-sql/11-downgrading-my-sql/03-downgrade-notes.md',
					},
					{
						text: '2.11.4 Desatualização de Instalações Binárias e Baseadas em Pacotes no Unix/Linux',
						link: '/03-installing-and-upgrading-my-sql/11-downgrading-my-sql/04-downgrading-binary-and-package-based-installations-on-unix-linux.md',
					},
					{
						text: '2.11.5 Solução de problemas de downgrade',
						link: '/03-installing-and-upgrading-my-sql/11-downgrading-my-sql/05-downgrade-troubleshooting.md',
					},
				],
				link: '/03-installing-and-upgrading-my-sql/11-downgrading-my-sql/index.md',
			},
			{
				text: '2.12 Notas de instalação do Perl',
				collapsed: true,
				items: [
					{
						text: '2.12.1 Instalar o Perl no Unix',
						link: '/03-installing-and-upgrading-my-sql/12-perl-installation-notes/01-installing-perl-on-unix.md',
					},
					{
						text: '2.12.2 Instalação do ActiveState Perl no Windows',
						link: '/03-installing-and-upgrading-my-sql/12-perl-installation-notes/02-installing-active-state-perl-on-windows.md',
					},
					{
						text: '2.12.3 Problemas ao usar a interface Perl DBI/DBD',
						link: '/03-installing-and-upgrading-my-sql/12-perl-installation-notes/03-problems-using-the-perl-d-b-i-d-b-d-interface.md',
					},
				],
				link: '/03-installing-and-upgrading-my-sql/12-perl-installation-notes/index.md',
			},
		],
		link: '/03-installing-and-upgrading-my-sql/index.md',
	},
	{
		text: 'Capítulo 3 - Tutorial',
		collapsed: true,
		items: [
			{
				text: '3.1 Conectar e desconectar do servidor',
				link: '/04-tutorial/01-connecting-to-and-disconnecting-from-the-server.md',
			},
			{
				text: '3.2 Inserindo Consultas',
				link: '/04-tutorial/02-entering-queries.md',
			},
			{
				text: '3.4 Obtendo Informações sobre Bancos de Dados e Tabelas',
				link: '/04-tutorial/04-getting-information-about-databases-and-tables.md',
			},
			{
				text: '3.5 Usando o mysql no Modo de Batch',
				link: '/04-tutorial/05-using-mysql-in-batch-mode.md',
			},
			{
				text: '3.7 Usando o MySQL com o Apache',
				link: '/04-tutorial/07-using-my-s-q-l-with-apache.md',
			},
			{
				text: '3.3 Criando e usando um banco de dados',
				collapsed: true,
				items: [
					{
						text: '3.3.1 Criando e selecionando um banco de dados',
						link: '/04-tutorial/03-creating-and-using-a-database/01-creating-and-selecting-a-database.md',
					},
					{
						text: '3.3.2 Criando uma Tabela',
						link: '/04-tutorial/03-creating-and-using-a-database/02-creating-a-table.md',
					},
					{
						text: '3.3.3 Carregando dados em uma tabela',
						link: '/04-tutorial/03-creating-and-using-a-database/03-loading-data-into-a-table.md',
					},
					{
						text: '3.3.4 Recuperação de informações de uma tabela',
						collapsed: true,
						items: [
							{
								text: '3.3.4.1 Selecionando todos os dados',
								link: '/04-tutorial/03-creating-and-using-a-database/04-retrieving-information-from-a-table/01-selecting-all-data.md',
							},
							{
								text: '3.3.4.2 Selecionando Linhas Específicas',
								link: '/04-tutorial/03-creating-and-using-a-database/04-retrieving-information-from-a-table/02-selecting-particular-rows.md',
							},
							{
								text: '3.3.4.3 Selecionando Colunas Específicas',
								link: '/04-tutorial/03-creating-and-using-a-database/04-retrieving-information-from-a-table/03-selecting-particular-columns.md',
							},
							{
								text: '3.3.4.4 Sorter de Linhas',
								link: '/04-tutorial/03-creating-and-using-a-database/04-retrieving-information-from-a-table/04-sorting-rows.md',
							},
							{
								text: '3.3.4.5 Cálculos de data',
								link: '/04-tutorial/03-creating-and-using-a-database/04-retrieving-information-from-a-table/05-date-calculations.md',
							},
							{
								text: '3.3.4.6 Trabalhando com Valores NULL',
								link: '/04-tutorial/03-creating-and-using-a-database/04-retrieving-information-from-a-table/06-working-with-n-u-l-l-values.md',
							},
							{
								text: '3.3.4.7 Correspondência de Padrões',
								link: '/04-tutorial/03-creating-and-using-a-database/04-retrieving-information-from-a-table/07-pattern-matching.md',
							},
							{
								text: '3.3.4.8 Contagem de Linhas',
								link: '/04-tutorial/03-creating-and-using-a-database/04-retrieving-information-from-a-table/08-counting-rows.md',
							},
							{
								text: '3.3.4.9 Usar mais de uma tabela',
								link: '/04-tutorial/03-creating-and-using-a-database/04-retrieving-information-from-a-table/09-using-more-than-one-table.md',
							},
						],
						link: '/04-tutorial/03-creating-and-using-a-database/04-retrieving-information-from-a-table/index.md',
					},
				],
				link: '/04-tutorial/03-creating-and-using-a-database/index.md',
			},
			{
				text: '3.6 Exemplos de Perguntas Comuns',
				collapsed: true,
				items: [
					{
						text: '3.6.1 O Valor Máximo para uma Coluna',
						link: '/04-tutorial/06-examples-of-common-queries/01-the-maximum-value-for-a-column.md',
					},
					{
						text: '3.6.2 A linha que contém o valor máximo de uma determinada coluna',
						link: '/04-tutorial/06-examples-of-common-queries/02-the-row-holding-the-maximum-of-a-certain-column.md',
					},
					{
						text: '3.6.3 Máximo de Colunas por Grupo',
						link: '/04-tutorial/06-examples-of-common-queries/03-maximum-of-column-per-group.md',
					},
					{
						text: '3.6.4 As Linhas que Armazenam o Máximo por Grupo de uma Cálculo Específica',
						link: '/04-tutorial/06-examples-of-common-queries/04-the-rows-holding-the-group-wise-maximum-of-a-certain-column.md',
					},
					{
						text: '3.6.5 Uso de variáveis definidas pelo usuário',
						link: '/04-tutorial/06-examples-of-common-queries/05-using-user-defined-variables.md',
					},
					{
						text: '3.6.6 Uso de Chaves Estrangeiras',
						link: '/04-tutorial/06-examples-of-common-queries/06-using-foreign-keys.md',
					},
					{
						text: '3.6.7 Pesquisar em duas chaves',
						link: '/04-tutorial/06-examples-of-common-queries/07-searching-on-two-keys.md',
					},
					{
						text: '3.6.8 Cálculo de visitas por dia',
						link: '/04-tutorial/06-examples-of-common-queries/08-calculating-visits-per-day.md',
					},
					{
						text: '3.6.9 Usando AUTO_INCREMENT',
						link: '/04-tutorial/06-examples-of-common-queries/09-using-a-u-t-o-increment.md',
					},
				],
				link: '/04-tutorial/06-examples-of-common-queries/index.md',
			},
		],
		link: '/04-tutorial/index.md',
	},
	{
		text: 'Capítulo 4 Programas MySQL',
		collapsed: true,
		items: [
			{
				text: '4.1 Visão geral dos programas do MySQL',
				link: '/05-mysql-programs/01-overview-of-my-s-q-l-programs.md',
			},
			{
				text: '4.9 Variáveis de ambiente',
				link: '/05-mysql-programs/09-environment-variables.md',
			},
			{
				text: '4.10 Gerenciamento de Sinais Unix no MySQL',
				link: '/05-mysql-programs/10-unix-signal-handling-in-my-sql.md',
			},
			{
				text: '4.2 Usando programas MySQL',
				collapsed: true,
				items: [
					{
						text: '4.2.1 Chamando programas MySQL',
						link: '/05-mysql-programs/02-using-my-s-q-l-programs/01-invoking-my-s-q-l-programs.md',
					},
					{
						text: '4.2.3 Opções de comando para conectar ao servidor',
						link: '/05-mysql-programs/02-using-my-s-q-l-programs/03-command-options-for-connecting-to-the-server.md',
					},
					{
						text: '4.2.4 Conectando ao servidor MySQL usando opções de comando',
						link: '/05-mysql-programs/02-using-my-s-q-l-programs/04-connecting-to-the-my-s-q-l-server-using-command-options.md',
					},
					{
						text: '4.2.5 Protocolos de transporte de conexão',
						link: '/05-mysql-programs/02-using-my-s-q-l-programs/05-connection-transport-protocols.md',
					},
					{
						text: '4.2.6 Controle de compressão da conexão',
						link: '/05-mysql-programs/02-using-my-s-q-l-programs/06-connection-compression-control.md',
					},
					{
						text: '4.2.7 Definindo variáveis de ambiente',
						link: '/05-mysql-programs/02-using-my-s-q-l-programs/07-setting-environment-variables.md',
					},
					{
						text: '4.2.2 Especificação das Opções do Programa',
						collapsed: true,
						items: [
							{
								text: '4.2.2.1 Usar opções na linha de comando',
								link: '/05-mysql-programs/02-using-my-s-q-l-programs/02-specifying-program-options/01-using-options-on-the-command-line.md',
							},
							{
								text: '4.2.2.2 Uso de arquivos de opção',
								link: '/05-mysql-programs/02-using-my-s-q-l-programs/02-specifying-program-options/02-using-option-files.md',
							},
							{
								text: '4.2.2.3 Opções de linha de comando que afetam o tratamento de arquivos com Option',
								link: '/05-mysql-programs/02-using-my-s-q-l-programs/02-specifying-program-options/03-command-line-options-that-affect-option-file-handling.md',
							},
							{
								text: '4.2.2.4 Modificadores de Opção do Programa',
								link: '/05-mysql-programs/02-using-my-s-q-l-programs/02-specifying-program-options/04-program-option-modifiers.md',
							},
							{
								text: '4.2.2.5 Usar Opções para Definir Variáveis do Programa',
								link: '/05-mysql-programs/02-using-my-s-q-l-programs/02-specifying-program-options/05-using-options-to-set-program-variables.md',
							},
							{
								text: '4.2.2.6 Opções Padrão, Valores Esperados de Opções e o Sinal de Igual (=)',
								link: '/05-mysql-programs/02-using-my-s-q-l-programs/02-specifying-program-options/06-option-defaults-options-expecting-values-and-the-sign.md',
							},
						],
						link: '/05-mysql-programs/02-using-my-s-q-l-programs/02-specifying-program-options/index.md',
					},
				],
				link: '/05-mysql-programs/02-using-my-s-q-l-programs/index.md',
			},
			{
				text: '4.3 Servidores e programas de inicialização do servidor',
				collapsed: true,
				items: [
					{
						text: '4.3.1 mysqld — O Servidor MySQL',
						link: '/05-mysql-programs/03-server-and-server-startup-programs/01-mysqld-the-my-s-q-l-server.md',
					},
					{
						text: '4.3.2 mysqld_safe — Script de inicialização do servidor MySQL',
						link: '/05-mysql-programs/03-server-and-server-startup-programs/02-mysqld-safe-my-s-q-l-server-startup-script.md',
					},
					{
						text: '4.3.3 mysql.server — Script de inicialização do servidor MySQL',
						link: '/05-mysql-programs/03-server-and-server-startup-programs/03-mysql-server-my-s-q-l-server-startup-script.md',
					},
					{
						text: '4.3.4 mysqld_multi — Gerenciar múltiplos servidores MySQL',
						link: '/05-mysql-programs/03-server-and-server-startup-programs/04-mysqld-multi-manage-multiple-my-s-q-l-servers.md',
					},
				],
				link: '/05-mysql-programs/03-server-and-server-startup-programs/index.md',
			},
			{
				text: '4.4 Programas relacionados à instalação',
				collapsed: true,
				items: [
					{
						text: '4.4.1 comp_err — Arquivo de Mensagem de Erro de Compilação do MySQL',
						link: '/05-mysql-programs/04-installation-related-programs/01-comp-err-compile-my-s-q-l-error-message-file.md',
					},
					{
						text: '4.4.2 mysql_install_db — Inicializar o diretório de dados do MySQL',
						link: '/05-mysql-programs/04-installation-related-programs/02-mysql-install-db-initialize-my-s-q-l-data-directory.md',
					},
					{
						text: '4.4.3 mysql_plugin — Configurar plugins do servidor MySQL',
						link: '/05-mysql-programs/04-installation-related-programs/03-mysql-plugin-configure-my-s-q-l-server-plugins.md',
					},
					{
						text: '4.4.4 mysql_secure_installation — Melhorar a segurança da instalação do MySQL',
						link: '/05-mysql-programs/04-installation-related-programs/04-mysql-secure-installation-improve-my-s-q-l-installation-security.md',
					},
					{
						text: '4.4.5 mysql_ssl_rsa_setup — Criar arquivos SSL/RSA',
						link: '/05-mysql-programs/04-installation-related-programs/05-mysql-ssl-rsa-setup-create-s-s-l-r-s-a-files.md',
					},
					{
						text: '4.4.6 mysql_tzinfo_to_sql — Carregar as tabelas de fuso horário',
						link: '/05-mysql-programs/04-installation-related-programs/06-mysql-tzinfo-to-sql-load-the-time-zone-tables.md',
					},
					{
						text: '4.4.7 mysql_upgrade — Verificar e atualizar tabelas do MySQL',
						link: '/05-mysql-programs/04-installation-related-programs/07-mysql-upgrade-check-and-upgrade-my-s-q-l-tables.md',
					},
				],
				link: '/05-mysql-programs/04-installation-related-programs/index.md',
			},
			{
				text: '4.5 Programas para clientes',
				collapsed: true,
				items: [
					{
						text: '4.5.2 mysqladmin — Um programa de administração do servidor MySQL',
						link: '/05-mysql-programs/05-client-programs/02-mysqladmin-a-my-s-q-l-server-administration-program.md',
					},
					{
						text: '4.5.3 mysqlcheck — Um programa de manutenção de tabelas',
						link: '/05-mysql-programs/05-client-programs/03-mysqlcheck-a-table-maintenance-program.md',
					},
					{
						text: '4.5.4 mysqldump — Um programa de backup de banco de dados',
						link: '/05-mysql-programs/05-client-programs/04-mysqldump-a-database-backup-program.md',
					},
					{
						text: '4.5.5 mysqlimport — Um programa de importação de dados',
						link: '/05-mysql-programs/05-client-programs/05-mysqlimport-a-data-import-program.md',
					},
					{
						text: '4.5.6 mysqlpump — Um programa de backup de banco de dados',
						link: '/05-mysql-programs/05-client-programs/06-mysqlpump-a-database-backup-program.md',
					},
					{
						text: '4.5.7 mysqlshow — Exibir informações da base de dados, tabela e coluna',
						link: '/05-mysql-programs/05-client-programs/07-mysqlshow-display-database-table-and-column-information.md',
					},
					{
						text: '4.5.8 mysqlslap — Um cliente de emulação de carga',
						link: '/05-mysql-programs/05-client-programs/08-mysqlslap-a-load-emulation-client.md',
					},
					{
						text: '4.5.1 mysql — O cliente de linha de comando do MySQL',
						collapsed: true,
						items: [
							{
								text: '4.5.1.1 Opções do cliente do MySQL',
								link: '/05-mysql-programs/05-client-programs/01-mysql-the-my-s-q-l-command-line-client/01-mysql-client-options.md',
							},
							{
								text: '4.5.1.2 Comandos do cliente do MySQL',
								link: '/05-mysql-programs/05-client-programs/01-mysql-the-my-s-q-l-command-line-client/02-mysql-client-commands.md',
							},
							{
								text: '4.5.1.3 Registro do cliente do MySQL',
								link: '/05-mysql-programs/05-client-programs/01-mysql-the-my-s-q-l-command-line-client/03-mysql-client-logging.md',
							},
							{
								text: '4.5.1.4 Ajuda no lado do servidor do cliente MySQL',
								link: '/05-mysql-programs/05-client-programs/01-mysql-the-my-s-q-l-command-line-client/04-mysql-client-server-side-help.md',
							},
							{
								text: '4.5.1.5 Executando instruções SQL a partir de um arquivo de texto',
								link: '/05-mysql-programs/05-client-programs/01-mysql-the-my-s-q-l-command-line-client/05-executing-s-q-l-statements-from-a-text-file.md',
							},
							{
								text: '4.5.1.6 Dicas do cliente do MySQL',
								link: '/05-mysql-programs/05-client-programs/01-mysql-the-my-s-q-l-command-line-client/06-mysql-client-tips.md',
							},
						],
						link: '/05-mysql-programs/05-client-programs/01-mysql-the-my-s-q-l-command-line-client/index.md',
					},
				],
				link: '/05-mysql-programs/05-client-programs/index.md',
			},
			{
				text: '4.6 Programas Administrativos e de Utilidade',
				collapsed: true,
				items: [
					{
						text: '4.6.1 innochecksum — Ferramenta de verificação de checksum de arquivo InnoDB offline',
						link: '/05-mysql-programs/06-administrative-and-utility-programs/01-innochecksum-offline-inno-d-b-file-checksum-utility.md',
					},
					{
						text: '4.6.2 myisam_ftdump — Exibir informações do índice de texto completo',
						link: '/05-mysql-programs/06-administrative-and-utility-programs/02-myisam-ftdump-display-full-text-index-information.md',
					},
					{
						text: '4.6.4 myisamlog — Exibir o conteúdo do arquivo de log MyISAM',
						link: '/05-mysql-programs/06-administrative-and-utility-programs/04-myisamlog-display-my-i-s-a-m-log-file-contents.md',
					},
					{
						text: '4.6.5 myisampack — Gerar tabelas MyISAM comprimidas e somente de leitura',
						link: '/05-mysql-programs/06-administrative-and-utility-programs/05-myisampack-generate-compressed-read-only-my-i-s-a-m-tables.md',
					},
					{
						text: '4.6.6 mysql_config_editor — Ferramenta de configuração do MySQL',
						link: '/05-mysql-programs/06-administrative-and-utility-programs/06-mysql-config-editor-my-s-q-l-configuration-utility.md',
					},
					{
						text: '4.6.8 mysqldumpslow — Resumir arquivos de registro de consultas lentas',
						link: '/05-mysql-programs/06-administrative-and-utility-programs/08-mysqldumpslow-summarize-slow-query-log-files.md',
					},
					{
						text: '4.6.3 myisamchk — Ferramenta de manutenção de tabelas MyISAM',
						collapsed: true,
						items: [
							{
								text: '4.6.3.1 Opções Gerais do myisamchk',
								link: '/05-mysql-programs/06-administrative-and-utility-programs/03-myisamchk-my-i-s-a-m-table-maintenance-utility/01-myisamchk-general-options.md',
							},
							{
								text: '4.6.3.2 myisamchk Verificar opções',
								link: '/05-mysql-programs/06-administrative-and-utility-programs/03-myisamchk-my-i-s-a-m-table-maintenance-utility/02-myisamchk-check-options.md',
							},
							{
								text: '4.6.3.3 Opções de reparo do myisamchk',
								link: '/05-mysql-programs/06-administrative-and-utility-programs/03-myisamchk-my-i-s-a-m-table-maintenance-utility/03-myisamchk-repair-options.md',
							},
							{
								text: '4.6.3.4 Outras opções do myisamchk',
								link: '/05-mysql-programs/06-administrative-and-utility-programs/03-myisamchk-my-i-s-a-m-table-maintenance-utility/04-other-myisamchk-options.md',
							},
							{
								text: '4.6.3.5 Obter informações da tabela com myisamchk',
								link: '/05-mysql-programs/06-administrative-and-utility-programs/03-myisamchk-my-i-s-a-m-table-maintenance-utility/05-obtaining-table-information-with-myisamchk.md',
							},
							{
								text: '4.6.3.6 Uso de memória do myisamchk',
								link: '/05-mysql-programs/06-administrative-and-utility-programs/03-myisamchk-my-i-s-a-m-table-maintenance-utility/06-myisamchk-memory-usage.md',
							},
						],
						link: '/05-mysql-programs/06-administrative-and-utility-programs/03-myisamchk-my-i-s-a-m-table-maintenance-utility/index.md',
					},
					{
						text: '4.6.7 mysqlbinlog — Ferramenta para processar arquivos de log binários',
						collapsed: true,
						items: [
							{
								text: '4.6.7.1 Formato de Hex Dump do mysqlbinlog',
								link: '/05-mysql-programs/06-administrative-and-utility-programs/07-mysqlbinlog-utility-for-processing-binary-log-files/01-mysqlbinlog-hex-dump-format.md',
							},
							{
								text: '4.6.7.2 Exibição de eventos de linha do mysqlbinlog',
								link: '/05-mysql-programs/06-administrative-and-utility-programs/07-mysqlbinlog-utility-for-processing-binary-log-files/02-mysqlbinlog-row-event-display.md',
							},
							{
								text: '4.6.7.3 Usar mysqlbinlog para fazer backup de arquivos de log binário',
								link: '/05-mysql-programs/06-administrative-and-utility-programs/07-mysqlbinlog-utility-for-processing-binary-log-files/03-using-mysqlbinlog-to-back-up-binary-log-files.md',
							},
							{
								text: '4.6.7.4 Especificar o ID do servidor mysqlbinlog',
								link: '/05-mysql-programs/06-administrative-and-utility-programs/07-mysqlbinlog-utility-for-processing-binary-log-files/04-specifying-the-mysqlbinlog-server-id.md',
							},
						],
						link: '/05-mysql-programs/06-administrative-and-utility-programs/07-mysqlbinlog-utility-for-processing-binary-log-files/index.md',
					},
				],
				link: '/05-mysql-programs/06-administrative-and-utility-programs/index.md',
			},
			{
				text: '4.7 Ferramentas de desenvolvimento de programas',
				collapsed: true,
				items: [
					{
						text: '4.7.1 mysql_config — Exibir opções para a compilação de clientes',
						link: '/05-mysql-programs/07-program-development-utilities/01-mysql-config-display-options-for-compiling-clients.md',
					},
					{
						text: '4.7.2 my_print_defaults — Opções de exibição a partir de arquivos de opção',
						link: '/05-mysql-programs/07-program-development-utilities/02-my-print-defaults-display-options-from-option-files.md',
					},
					{
						text: '4.7.3 resolve_stack_dump — Resolver o dump da pilha numérica para símbolos',
						link: '/05-mysql-programs/07-program-development-utilities/03-resolve-stack-dump-resolve-numeric-stack-trace-dump-to-symbols.md',
					},
				],
				link: '/05-mysql-programs/07-program-development-utilities/index.md',
			},
			{
				text: '4.8 Programas diversos',
				collapsed: true,
				items: [
					{
						text: '4.8.1 lz4_decompress — Descompactar saída comprimida do mysqlpump com LZ4',
						link: '/05-mysql-programs/08-miscellaneous-programs/01-lz4-decompress-decompress-mysqlpump-l-z-4-compressed-output.md',
					},
					{
						text: '4.8.2 perror — Exibir informações de mensagem de erro do MySQL',
						link: '/05-mysql-programs/08-miscellaneous-programs/02-perror-display-my-s-q-l-error-message-information.md',
					},
					{
						text: '4.8.3 replace — Uma Ferramenta de Substituição de Texto',
						link: '/05-mysql-programs/08-miscellaneous-programs/03-replace-a-string-replacement-utility.md',
					},
					{
						text: '4.8.4 resolveip — Resolver nome de host para endereço IP ou vice-versa',
						link: '/05-mysql-programs/08-miscellaneous-programs/04-resolveip-resolve-host-name-to-i-p-address-or-vice-versa.md',
					},
					{
						text: '4.8.5 zlib_decompress — Descompactar o resultado comprimido do mysqlpump com o formato ZLIB',
						link: '/05-mysql-programs/08-miscellaneous-programs/05-zlib-decompress-decompress-mysqlpump-zlib-compressed-output.md',
					},
				],
				link: '/05-mysql-programs/08-miscellaneous-programs/index.md',
			},
		],
		link: '/05-mysql-programs/index.md',
	},
	{
		text: 'Capítulo 5: Administração do Servidor MySQL',
		collapsed: true,
		items: [
			{
				text: '5.2 O Diretório de Dados MySQL',
				link: '/06-my-s-q-l-server-administration/02-the-my-s-q-l-data-directory.md',
			},
			{
				text: '5.3 Banco de Dados do Sistema mysql',
				link: '/06-my-s-q-l-server-administration/03-the-mysql-system-database.md',
			},
			{
				text: '5.1 O Servidor MySQL',
				collapsed: true,
				items: [
					{
						text: '5.1.1 Configurando o servidor',
						link: '/06-my-s-q-l-server-administration/01-the-my-s-q-l-server/01-configuring-the-server.md',
					},
					{
						text: '5.1.2 Configurações Padrão do Servidor',
						link: '/06-my-s-q-l-server-administration/01-the-my-s-q-l-server/02-server-configuration-defaults.md',
					},
					{
						text: '5.1.3 Referência à Opção do Servidor, à Variável do Sistema e à Variável de Status',
						link: '/06-my-s-q-l-server-administration/01-the-my-s-q-l-server/03-server-option-system-variable-and-status-variable-reference.md',
					},
					{
						text: '5.1.4 Referência de variável do sistema do servidor',
						link: '/06-my-s-q-l-server-administration/01-the-my-s-q-l-server/04-server-system-variable-reference.md',
					},
					{
						text: '5.1.5 Referência da variável de status do servidor',
						link: '/06-my-s-q-l-server-administration/01-the-my-s-q-l-server/05-server-status-variable-reference.md',
					},
					{
						text: '5.1.6 Opções de comando do servidor',
						link: '/06-my-s-q-l-server-administration/01-the-my-s-q-l-server/06-server-command-options.md',
					},
					{
						text: '5.1.7 Variáveis do Sistema de Servidor',
						link: '/06-my-s-q-l-server-administration/01-the-my-s-q-l-server/07-server-system-variables.md',
					},
					{
						text: '5.1.9 Variáveis de Status do Servidor',
						link: '/06-my-s-q-l-server-administration/01-the-my-s-q-l-server/09-server-status-variables.md',
					},
					{
						text: '5.1.10 Modos do SQL do servidor',
						link: '/06-my-s-q-l-server-administration/01-the-my-s-q-l-server/10-server-s-q-l-modes.md',
					},
					{
						text: '5.1.13 Suporte de Fuso Horário do MySQL Server',
						link: '/06-my-s-q-l-server-administration/01-the-my-s-q-l-server/13-my-s-q-l-server-time-zone-support.md',
					},
					{
						text: '5.1.14 Suporte de Ajuda no Servidor',
						link: '/06-my-s-q-l-server-administration/01-the-my-s-q-l-server/14-server-side-help-support.md',
					},
					{
						text: '5.1.15 Rastreamento do servidor do estado da sessão do cliente',
						link: '/06-my-s-q-l-server-administration/01-the-my-s-q-l-server/15-server-tracking-of-client-session-state.md',
					},
					{
						text: '5.1.16 Processo de Desligamento do Servidor',
						link: '/06-my-s-q-l-server-administration/01-the-my-s-q-l-server/16-the-server-shutdown-process.md',
					},
					{
						text: '5.1.8 Usando variáveis do sistema',
						collapsed: true,
						items: [
							{
								text: '5.1.8.1 Privilegios de variáveis de sistema',
								link: '/06-my-s-q-l-server-administration/01-the-my-s-q-l-server/08-using-system-variables/01-system-variable-privileges.md',
							},
							{
								text: '5.1.8.2 Variáveis dinâmicas do sistema',
								link: '/06-my-s-q-l-server-administration/01-the-my-s-q-l-server/08-using-system-variables/02-dynamic-system-variables.md',
							},
							{
								text: '5.1.8.3 Variáveis de sistema estruturado',
								link: '/06-my-s-q-l-server-administration/01-the-my-s-q-l-server/08-using-system-variables/03-structured-system-variables.md',
							},
						],
						link: '/06-my-s-q-l-server-administration/01-the-my-s-q-l-server/08-using-system-variables/index.md',
					},
					{
						text: '5.1.11 Gerenciamento de Conexão',
						collapsed: true,
						items: [
							{
								text: '5.1.11.1 Interfaces de conexão',
								link: '/06-my-s-q-l-server-administration/01-the-my-s-q-l-server/11-connection-management/01-connection-interfaces.md',
							},
							{
								text: '5.1.11.2 Consultas de DNS e Cache de Anfitriões',
								link: '/06-my-s-q-l-server-administration/01-the-my-s-q-l-server/11-connection-management/02-d-n-s-lookups-and-the-host-cache.md',
							},
						],
						link: '/06-my-s-q-l-server-administration/01-the-my-s-q-l-server/11-connection-management/index.md',
					},
					{
						text: '5.1.12 Suporte ao IPv6',
						collapsed: true,
						items: [
							{
								text: '5.1.12.1 Verificar o suporte do sistema para IPv6',
								link: '/06-my-s-q-l-server-administration/01-the-my-s-q-l-server/12-i-pv6-support/01-verifying-system-support-for-i-pv6.md',
							},
							{
								text: '5.1.12.2 Configurando o servidor MySQL para permitir conexões IPv6',
								link: '/06-my-s-q-l-server-administration/01-the-my-s-q-l-server/12-i-pv6-support/02-configuring-the-my-s-q-l-server-to-permit-i-pv6-connections.md',
							},
							{
								text: '5.1.12.3 Conectar usando o endereço do host local IPv6',
								link: '/06-my-s-q-l-server-administration/01-the-my-s-q-l-server/12-i-pv6-support/03-connecting-using-the-i-pv6-local-host-address.md',
							},
							{
								text: '5.1.12.4 Conectar usando endereços de host não locais IPv6',
								link: '/06-my-s-q-l-server-administration/01-the-my-s-q-l-server/12-i-pv6-support/04-connecting-using-i-pv6-nonlocal-host-addresses.md',
							},
							{
								text: '5.1.12.5. Obter uma Endereço IPv6 de um Broker',
								link: '/06-my-s-q-l-server-administration/01-the-my-s-q-l-server/12-i-pv6-support/05-obtaining-an-i-pv6-address-from-a-broker.md',
							},
						],
						link: '/06-my-s-q-l-server-administration/01-the-my-s-q-l-server/12-i-pv6-support/index.md',
					},
				],
				link: '/06-my-s-q-l-server-administration/01-the-my-s-q-l-server/index.md',
			},
			{
				text: '5.4 Registros do servidor MySQL',
				collapsed: true,
				items: [
					{
						text: '5.4.1 Selecionando destinos de saída do Log de consulta geral e do Log de consulta lenta',
						link: '/06-my-s-q-l-server-administration/04-my-s-q-l-server-logs/01-selecting-general-query-log-and-slow-query-log-output-destinations.md',
					},
					{
						text: '5.4.3 O Log de Consulta Geral',
						link: '/06-my-s-q-l-server-administration/04-my-s-q-l-server-logs/03-the-general-query-log.md',
					},
					{
						text: '5.4.5 O Log de Consultas Lentas',
						link: '/06-my-s-q-l-server-administration/04-my-s-q-l-server-logs/05-the-slow-query-log.md',
					},
					{
						text: '5.4.6 O Log do DDL',
						link: '/06-my-s-q-l-server-administration/04-my-s-q-l-server-logs/06-the-d-d-l-log.md',
					},
					{
						text: '5.4.7 Manutenção do Log do Servidor',
						link: '/06-my-s-q-l-server-administration/04-my-s-q-l-server-logs/07-server-log-maintenance.md',
					},
					{
						text: '5.4.2 Diário de Erros',
						collapsed: true,
						items: [
							{
								text: '5.4.2.1 Registro de erros no Windows',
								link: '/06-my-s-q-l-server-administration/04-my-s-q-l-server-logs/02-the-error-log/01-error-logging-on-windows.md',
							},
							{
								text: '5.4.2.2 Registro de erros em sistemas Unix e Unix-like',
								link: '/06-my-s-q-l-server-administration/04-my-s-q-l-server-logs/02-the-error-log/02-error-logging-on-unix-and-unix-like-systems.md',
							},
							{
								text: '5.4.2.3 Registro de erros no log do sistema',
								link: '/06-my-s-q-l-server-administration/04-my-s-q-l-server-logs/02-the-error-log/03-error-logging-to-the-system-log.md',
							},
							{
								text: '5.4.2.4 Filtro do Log de Erros',
								link: '/06-my-s-q-l-server-administration/04-my-s-q-l-server-logs/02-the-error-log/04-error-log-filtering.md',
							},
							{
								text: '5.4.2.5 Formato de Saída do Log de Erros',
								link: '/06-my-s-q-l-server-administration/04-my-s-q-l-server-logs/02-the-error-log/05-error-log-output-format.md',
							},
							{
								text: '5.4.2.6 Limpeza e renomeação do arquivo de registro de erros',
								link: '/06-my-s-q-l-server-administration/04-my-s-q-l-server-logs/02-the-error-log/06-error-log-file-flushing-and-renaming.md',
							},
						],
						link: '/06-my-s-q-l-server-administration/04-my-s-q-l-server-logs/02-the-error-log/index.md',
					},
					{
						text: '5.4.4 O Log Binário',
						collapsed: true,
						items: [
							{
								text: '5.4.4.1 Formatos de registro binários',
								link: '/06-my-s-q-l-server-administration/04-my-s-q-l-server-logs/04-the-binary-log/01-binary-logging-formats.md',
							},
							{
								text: '5.4.4.2 Definindo o formato do log binário',
								link: '/06-my-s-q-l-server-administration/04-my-s-q-l-server-logs/04-the-binary-log/02-setting-the-binary-log-format.md',
							},
							{
								text: '5.4.4.3 Formato de registro binário misto',
								link: '/06-my-s-q-l-server-administration/04-my-s-q-l-server-logs/04-the-binary-log/03-mixed-binary-logging-format.md',
							},
							{
								text: '5.4.4.4 Formato de registro para alterações nas tabelas do banco de dados mysql',
								link: '/06-my-s-q-l-server-administration/04-my-s-q-l-server-logs/04-the-binary-log/04-logging-format-for-changes-to-mysql-database-tables.md',
							},
						],
						link: '/06-my-s-q-l-server-administration/04-my-s-q-l-server-logs/04-the-binary-log/index.md',
					},
				],
				link: '/06-my-s-q-l-server-administration/04-my-s-q-l-server-logs/index.md',
			},
			{
				text: '5.5 Plugins do MySQL Server',
				collapsed: true,
				items: [
					{
						text: '5.5.1 Instalação e Desinstalação de Plugins',
						link: '/06-my-s-q-l-server-administration/05-my-s-q-l-server-plugins/01-installing-and-uninstalling-plugins.md',
					},
					{
						text: '5.5.2 Obter informações do plugin do servidor',
						link: '/06-my-s-q-l-server-administration/05-my-s-q-l-server-plugins/02-obtaining-server-plugin-information.md',
					},
					{
						text: '5.5.3 Piscina de Fios da Empresa MySQL',
						collapsed: true,
						items: [
							{
								text: '5.5.3.1 Elementos do Pool de Fios',
								link: '/06-my-s-q-l-server-administration/05-my-s-q-l-server-plugins/03-my-s-q-l-enterprise-thread-pool/01-thread-pool-elements.md',
							},
							{
								text: '5.5.3.2 Instalação do Pool de Fios',
								link: '/06-my-s-q-l-server-administration/05-my-s-q-l-server-plugins/03-my-s-q-l-enterprise-thread-pool/02-thread-pool-installation.md',
							},
							{
								text: '5.5.3.3 Operação do Conjunto de Fios',
								link: '/06-my-s-q-l-server-administration/05-my-s-q-l-server-plugins/03-my-s-q-l-enterprise-thread-pool/03-thread-pool-operation.md',
							},
							{
								text: '5.5.3.4 Ajuste da Piscina de Fios',
								link: '/06-my-s-q-l-server-administration/05-my-s-q-l-server-plugins/03-my-s-q-l-enterprise-thread-pool/04-thread-pool-tuning.md',
							},
						],
						link: '/06-my-s-q-l-server-administration/05-my-s-q-l-server-plugins/03-my-s-q-l-enterprise-thread-pool/index.md',
					},
					{
						text: '5.5.4 O Plugin de Reescrita de Consultas Rewriter',
						collapsed: true,
						items: [
							{
								text: '5.5.4.1 Instalar ou desinstalar o plugin de reescrita de consultas Rewriter',
								link: '/06-my-s-q-l-server-administration/05-my-s-q-l-server-plugins/04-the-rewriter-query-rewrite-plugin/01-installing-or-uninstalling-the-rewriter-query-rewrite-plugin.md',
							},
							{
								text: '5.5.4.2 Usar o Plugin de Reescrita de Consultas do Rewriter',
								link: '/06-my-s-q-l-server-administration/05-my-s-q-l-server-plugins/04-the-rewriter-query-rewrite-plugin/02-using-the-rewriter-query-rewrite-plugin.md',
							},
							{
								text: '5.5.4.3 Referência do Plugin de Reescrita de Consultas de Reescritor',
								link: '/06-my-s-q-l-server-administration/05-my-s-q-l-server-plugins/04-the-rewriter-query-rewrite-plugin/03-rewriter-query-rewrite-plugin-reference.md',
							},
						],
						link: '/06-my-s-q-l-server-administration/05-my-s-q-l-server-plugins/04-the-rewriter-query-rewrite-plugin/index.md',
					},
					{
						text: '5.5.5 Tokens de versão',
						collapsed: true,
						items: [
							{
								text: '5.5.5.1 Tokens de versão Elementos',
								link: '/06-my-s-q-l-server-administration/05-my-s-q-l-server-plugins/05-version-tokens/01-version-tokens-elements.md',
							},
							{
								text: '5.5.5.2 Instalar ou desinstalar tokens de versão',
								link: '/06-my-s-q-l-server-administration/05-my-s-q-l-server-plugins/05-version-tokens/02-installing-or-uninstalling-version-tokens.md',
							},
							{
								text: '5.5.5.3 Uso de Tokens de Versão',
								link: '/06-my-s-q-l-server-administration/05-my-s-q-l-server-plugins/05-version-tokens/03-using-version-tokens.md',
							},
							{
								text: '5.5.5.4 Referência de Tokens de Versão',
								link: '/06-my-s-q-l-server-administration/05-my-s-q-l-server-plugins/05-version-tokens/04-version-tokens-reference.md',
							},
						],
						link: '/06-my-s-q-l-server-administration/05-my-s-q-l-server-plugins/05-version-tokens/index.md',
					},
					{
						text: '5.5.6 Serviços de Plugin do MySQL',
						collapsed: true,
						items: [
							{
								text: '5.5.6.1 O Serviço de Bloqueio',
								link: '/06-my-s-q-l-server-administration/05-my-s-q-l-server-plugins/06-my-s-q-l-plugin-services/01-the-locking-service.md',
							},
							{
								text: '5.5.6.2 O Serviço de Chaveiro',
								link: '/06-my-s-q-l-server-administration/05-my-s-q-l-server-plugins/06-my-s-q-l-plugin-services/02-the-keyring-service.md',
							},
						],
						link: '/06-my-s-q-l-server-administration/05-my-s-q-l-server-plugins/06-my-s-q-l-plugin-services/index.md',
					},
				],
				link: '/06-my-s-q-l-server-administration/05-my-s-q-l-server-plugins/index.md',
			},
			{
				text: '5.6 Funções carregáveis do MySQL Server',
				collapsed: true,
				items: [
					{
						text: '5.6.1 Instalação e Desinstalação de Funções Carregáveis',
						link: '/06-my-s-q-l-server-administration/06-my-s-q-l-server-loadable-functions/01-installing-and-uninstalling-loadable-functions.md',
					},
					{
						text: '5.6.2 Obter informações sobre funções carregáveis',
						link: '/06-my-s-q-l-server-administration/06-my-s-q-l-server-loadable-functions/02-obtaining-information-about-loadable-functions.md',
					},
				],
				link: '/06-my-s-q-l-server-administration/06-my-s-q-l-server-loadable-functions/index.md',
			},
			{
				text: '5.7 Executando múltiplas instâncias do MySQL em uma única máquina',
				collapsed: true,
				items: [
					{
						text: '5.7.1 Configurando diretórios de dados múltiplos',
						link: '/06-my-s-q-l-server-administration/07-running-multiple-my-s-q-l-instances-on-one-machine/01-setting-up-multiple-data-directories.md',
					},
					{
						text: '5.7.3 Executando múltiplas instâncias do MySQL no Unix',
						link: '/06-my-s-q-l-server-administration/07-running-multiple-my-s-q-l-instances-on-one-machine/03-running-multiple-my-s-q-l-instances-on-unix.md',
					},
					{
						text: '5.7.4 Uso de programas do cliente em um ambiente de múltiplos servidores',
						link: '/06-my-s-q-l-server-administration/07-running-multiple-my-s-q-l-instances-on-one-machine/04-using-client-programs-in-a-multiple-server-environment.md',
					},
					{
						text: '5.7.2 Executando múltiplas instâncias do MySQL no Windows',
						collapsed: true,
						items: [
							{
								text: '5.7.2.1 Iniciar múltiplas instâncias do MySQL na linha de comando do Windows',
								link: '/06-my-s-q-l-server-administration/07-running-multiple-my-s-q-l-instances-on-one-machine/02-running-multiple-my-s-q-l-instances-on-windows/01-starting-multiple-my-s-q-l-instances-at-the-windows-command-line.md',
							},
							{
								text: '5.7.2.2 Iniciar múltiplas instâncias do MySQL como serviços do Windows',
								link: '/06-my-s-q-l-server-administration/07-running-multiple-my-s-q-l-instances-on-one-machine/02-running-multiple-my-s-q-l-instances-on-windows/02-starting-multiple-my-s-q-l-instances-as-windows-services.md',
							},
						],
						link: '/06-my-s-q-l-server-administration/07-running-multiple-my-s-q-l-instances-on-one-machine/02-running-multiple-my-s-q-l-instances-on-windows/index.md',
					},
				],
				link: '/06-my-s-q-l-server-administration/07-running-multiple-my-s-q-l-instances-on-one-machine/index.md',
			},
			{
				text: '5.8 Depuração do MySQL',
				collapsed: true,
				items: [
					{
						text: '5.8.2 Depuração de um cliente MySQL',
						link: '/06-my-s-q-l-server-administration/08-debugging-my-sql/02-debugging-a-my-s-q-l-client.md',
					},
					{
						text: '5.8.3 O Pacote DBUG',
						link: '/06-my-s-q-l-server-administration/08-debugging-my-sql/03-the-d-b-u-g-package.md',
					},
					{
						text: '5.8.1 Depuração de um servidor MySQL',
						collapsed: true,
						items: [
							{
								text: '5.8.1.1 Compilando o MySQL para depuração',
								link: '/06-my-s-q-l-server-administration/08-debugging-my-sql/01-debugging-a-my-s-q-l-server/01-compiling-my-s-q-l-for-debugging.md',
							},
							{
								text: '5.8.1.2 Criar arquivos de rastreamento',
								link: '/06-my-s-q-l-server-administration/08-debugging-my-sql/01-debugging-a-my-s-q-l-server/02-creating-trace-files.md',
							},
							{
								text: '5.8.1.3 Usar o WER com o PDB para criar um crashdump do Windows',
								link: '/06-my-s-q-l-server-administration/08-debugging-my-sql/01-debugging-a-my-s-q-l-server/03-using-w-e-r-with-p-d-b-to-create-a-windows-crashdump.md',
							},
							{
								text: '5.8.1.4 Depuração do mysqld no gdb',
								link: '/06-my-s-q-l-server-administration/08-debugging-my-sql/01-debugging-a-my-s-q-l-server/04-debugging-mysqld-under-gdb.md',
							},
							{
								text: '5.8.1.5 Usar uma Traça de Pilha',
								link: '/06-my-s-q-l-server-administration/08-debugging-my-sql/01-debugging-a-my-s-q-l-server/05-using-a-stack-trace.md',
							},
							{
								text: '5.8.1.6 Usar logs do servidor para encontrar as causas dos erros no mysqld',
								link: '/06-my-s-q-l-server-administration/08-debugging-my-sql/01-debugging-a-my-s-q-l-server/06-using-server-logs-to-find-causes-of-errors-in-mysqld.md',
							},
							{
								text: '5.8.1.7 Criar um Caso de Teste Se Você Experimente a Corrupção da Tabela',
								link: '/06-my-s-q-l-server-administration/08-debugging-my-sql/01-debugging-a-my-s-q-l-server/07-making-a-test-case-if-you-experience-table-corruption.md',
							},
						],
						link: '/06-my-s-q-l-server-administration/08-debugging-my-sql/01-debugging-a-my-s-q-l-server/index.md',
					},
					{
						text: '5.8.4 Rastreamento do mysqld usando o DTrace',
						collapsed: true,
						items: [
							{
								text: '5.8.4.1 Referência da sonda DTrace do mysqld',
								link: '/06-my-s-q-l-server-administration/08-debugging-my-sql/04-tracing-mysqld-using-d-trace/01-mysqld-d-trace-probe-reference.md',
							},
						],
						link: '/06-my-s-q-l-server-administration/08-debugging-my-sql/04-tracing-mysqld-using-d-trace/index.md',
					},
				],
				link: '/06-my-s-q-l-server-administration/08-debugging-my-sql/index.md',
			},
		],
		link: '/06-my-s-q-l-server-administration/index.md',
	},
	{
		text: 'Capítulo 6 Segurança',
		collapsed: true,
		items: [
			{
				text: '6.1 Questões Gerais de Segurança',
				collapsed: true,
				items: [
					{
						text: '6.1.1 Diretrizes de Segurança',
						link: '/07-security/01-general-security-issues/01-security-guidelines.md',
					},
					{
						text: '6.1.3 Tornar o MySQL seguro contra atacantes',
						link: '/07-security/01-general-security-issues/03-making-my-s-q-l-secure-against-attackers.md',
					},
					{
						text: '6.1.4 Opções e variáveis relacionadas à segurança do mysqld',
						link: '/07-security/01-general-security-issues/04-security-related-mysqld-options-and-variables.md',
					},
					{
						text: '6.1.5 Como executar o MySQL como um usuário normal',
						link: '/07-security/01-general-security-issues/05-how-to-run-my-s-q-l-as-a-normal-user.md',
					},
					{
						text: '6.1.6 Considerações de segurança para LOAD DATA LOCAL',
						link: '/07-security/01-general-security-issues/06-security-considerations-for-l-o-a-d-d-a-t-a-local.md',
					},
					{
						text: '6.1.7 Diretrizes de segurança para programação de clientes',
						link: '/07-security/01-general-security-issues/07-client-programming-security-guidelines.md',
					},
					{
						text: '6.1.2 Manter senhas seguras',
						collapsed: true,
						items: [
							{
								text: '6.1.2.1 Diretrizes para o Usuário Final sobre Segurança de Senhas',
								link: '/07-security/01-general-security-issues/02-keeping-passwords-secure/01-end-user-guidelines-for-password-security.md',
							},
							{
								text: '6.1.2.2 Diretrizes do administrador para a segurança da senha',
								link: '/07-security/01-general-security-issues/02-keeping-passwords-secure/02-administrator-guidelines-for-password-security.md',
							},
							{
								text: '6.1.2.3 Senhas e registro',
								link: '/07-security/01-general-security-issues/02-keeping-passwords-secure/03-passwords-and-logging.md',
							},
							{
								text: '6.1.2.4 Hash de senha no MySQL',
								link: '/07-security/01-general-security-issues/02-keeping-passwords-secure/04-password-hashing-in-my-sql.md',
							},
						],
						link: '/07-security/01-general-security-issues/02-keeping-passwords-secure/index.md',
					},
				],
				link: '/07-security/01-general-security-issues/index.md',
			},
			{
				text: '6.2 Controle de Acesso e Gerenciamento de Conta',
				collapsed: true,
				items: [
					{
						text: '6.2.1 Nomes de Usuários e Senhas de Conta',
						link: '/07-security/02-access-control-and-account-management/01-account-user-names-and-passwords.md',
					},
					{
						text: '6.2.2 Prêmios fornecidos pelo MySQL',
						link: '/07-security/02-access-control-and-account-management/02-privileges-provided-by-my-sql.md',
					},
					{
						text: '6.2.3 Tabelas de subsídios',
						link: '/07-security/02-access-control-and-account-management/03-grant-tables.md',
					},
					{
						text: '6.2.4 Especificação de Nomes de Conta',
						link: '/07-security/02-access-control-and-account-management/04-specifying-account-names.md',
					},
					{
						text: '6.2.5 Controle de Acesso, Etapa 1: Verificação de Conexão',
						link: '/07-security/02-access-control-and-account-management/05-access-control-stage-1-connection-verification.md',
					},
					{
						text: '6.2.6 Controle de Acesso, Etapa 2: Solicitação de Verificação',
						link: '/07-security/02-access-control-and-account-management/06-access-control-stage-2-request-verification.md',
					},
					{
						text: '6.2.7 Adicionar contas, atribuir privilégios e excluir contas',
						link: '/07-security/02-access-control-and-account-management/07-adding-accounts-assigning-privileges-and-dropping-accounts.md',
					},
					{
						text: '6.2.8 Contas Reservadas',
						link: '/07-security/02-access-control-and-account-management/08-reserved-accounts.md',
					},
					{
						text: '6.2.9 Quando as Alterações de Privilegios Se Tornam Efetivas',
						link: '/07-security/02-access-control-and-account-management/09-when-privilege-changes-take-effect.md',
					},
					{
						text: '6.2.10 Atribuição de senhas de conta',
						link: '/07-security/02-access-control-and-account-management/10-assigning-account-passwords.md',
					},
					{
						text: '6.2.11 Gerenciamento de Senhas',
						link: '/07-security/02-access-control-and-account-management/11-password-management.md',
					},
					{
						text: '6.2.12 Tratamento de senhas expiradas pelo servidor',
						link: '/07-security/02-access-control-and-account-management/12-server-handling-of-expired-passwords.md',
					},
					{
						text: '6.2.13 Autenticação encaixável',
						link: '/07-security/02-access-control-and-account-management/13-pluggable-authentication.md',
					},
					{
						text: '6.2.14 Usuários de Proxy',
						link: '/07-security/02-access-control-and-account-management/14-proxy-users.md',
					},
					{
						text: '6.2.15 Bloqueio da Conta',
						link: '/07-security/02-access-control-and-account-management/15-account-locking.md',
					},
					{
						text: '6.2.16 Definir limites de recursos da conta',
						link: '/07-security/02-access-control-and-account-management/16-setting-account-resource-limits.md',
					},
					{
						text: '6.2.17 Solução de problemas para conectar-se ao MySQL',
						link: '/07-security/02-access-control-and-account-management/17-troubleshooting-problems-connecting-to-my-sql.md',
					},
					{
						text: '6.2.18 Auditoria da Atividade da Conta Baseada em SQL',
						link: '/07-security/02-access-control-and-account-management/18-sql-based-account-activity-auditing.md',
					},
				],
				link: '/07-security/02-access-control-and-account-management/index.md',
			},
			{
				text: '6.3 Usando Conexões Encriptadas',
				collapsed: true,
				items: [
					{
						text: '6.3.1 Configurando o MySQL para usar conexões criptografadas',
						link: '/07-security/03-using-encrypted-connections/01-configuring-my-s-q-l-to-use-encrypted-connections.md',
					},
					{
						text: '6.3.2 Conexão Encriptada Protocolos e Cifras TLS',
						link: '/07-security/03-using-encrypted-connections/02-encrypted-connection-t-l-s-protocols-and-ciphers.md',
					},
					{
						text: '6.3.4 Capacidades dependentes da biblioteca SSL',
						link: '/07-security/03-using-encrypted-connections/04-s-s-l-library-dependent-capabilities.md',
					},
					{
						text: '6.3.5 Conectando-se ao MySQL remotamente a partir do Windows com SSH',
						link: '/07-security/03-using-encrypted-connections/05-connecting-to-my-s-q-l-remotely-from-windows-with-ssh.md',
					},
					{
						text: '6.3.3 Criação de certificados e chaves SSL e RSA',
						collapsed: true,
						items: [
							{
								text: '6.3.3.1 Criando Certificados e Chaves SSL e RSA usando MySQL',
								link: '/07-security/03-using-encrypted-connections/03-creating-s-s-l-and-r-s-a-certificates-and-keys/01-creating-s-s-l-and-r-s-a-certificates-and-keys-using-my-sql.md',
							},
							{
								text: '6.3.3.2 Criando Certificados e Chaves SSL Usando o openssl',
								link: '/07-security/03-using-encrypted-connections/03-creating-s-s-l-and-r-s-a-certificates-and-keys/02-creating-s-s-l-certificates-and-keys-using-openssl.md',
							},
							{
								text: '6.3.3.3 Criando Chaves RSA Usando o openssl',
								link: '/07-security/03-using-encrypted-connections/03-creating-s-s-l-and-r-s-a-certificates-and-keys/03-creating-r-s-a-keys-using-openssl.md',
							},
						],
						link: '/07-security/03-using-encrypted-connections/03-creating-s-s-l-and-r-s-a-certificates-and-keys/index.md',
					},
				],
				link: '/07-security/03-using-encrypted-connections/index.md',
			},
			{
				text: '6.4 Plugins de segurança',
				collapsed: true,
				items: [
					{
						text: '6.4.1 Plugins de autenticação',
						collapsed: true,
						items: [
							{
								text: '6.4.1.1 Autenticação Pluggable Nativa',
								link: '/07-security/04-security-plugins/01-authentication-plugins/01-native-pluggable-authentication.md',
							},
							{
								text: '6.4.1.2 Autenticação Plugável Native Antiga',
								link: '/07-security/04-security-plugins/01-authentication-plugins/02-old-native-pluggable-authentication.md',
							},
							{
								text: '6.4.1.3 Migrando para fora da hashing de senhas pré-4.1 e do plugin mysql_old_password',
								link: '/07-security/04-security-plugins/01-authentication-plugins/03-migrating-away-from-pre-4-1-password-hashing-and-the-mysql-old-password-plugin.md',
							},
							{
								text: '6.4.1.4 Caching de Autenticação Conectada SHA-2',
								link: '/07-security/04-security-plugins/01-authentication-plugins/04-caching-sha-2-pluggable-authentication.md',
							},
							{
								text: '6.4.1.5 Autenticação substituível SHA-256',
								link: '/07-security/04-security-plugins/01-authentication-plugins/05-sha-256-pluggable-authentication.md',
							},
							{
								text: '6.4.1.6 Autenticação de texto em claro plugável no lado do cliente',
								link: '/07-security/04-security-plugins/01-authentication-plugins/06-client-side-cleartext-pluggable-authentication.md',
							},
							{
								text: '6.4.1.7 Autenticação Pluggable PAM (PAM)',
								link: '/07-security/04-security-plugins/01-authentication-plugins/07-p-a-m-pluggable-authentication.md',
							},
							{
								text: '6.4.1.8 Autenticação Plugável no Windows',
								link: '/07-security/04-security-plugins/01-authentication-plugins/08-windows-pluggable-authentication.md',
							},
							{
								text: '6.4.1.9 Autenticação Pluggable LDAP',
								link: '/07-security/04-security-plugins/01-authentication-plugins/09-l-d-a-p-pluggable-authentication.md',
							},
							{
								text: '6.4.1.10 Autenticação Plugável sem Login',
								link: '/07-security/04-security-plugins/01-authentication-plugins/10-no-login-pluggable-authentication.md',
							},
							{
								text: '6.4.1.11 Autenticação de Pluggable Authentication com Credenciais de Peer de Soquete',
								link: '/07-security/04-security-plugins/01-authentication-plugins/11-socket-peer-credential-pluggable-authentication.md',
							},
							{
								text: '6.4.1.12 Teste de Autenticação Conectada',
								link: '/07-security/04-security-plugins/01-authentication-plugins/12-test-pluggable-authentication.md',
							},
							{
								text: '6.4.1.13 Variáveis do Sistema de Autenticação Conectable',
								link: '/07-security/04-security-plugins/01-authentication-plugins/13-pluggable-authentication-system-variables.md',
							},
						],
						link: '/07-security/04-security-plugins/01-authentication-plugins/index.md',
					},
					{
						text: '6.4.2 Plugins de controle de conexão',
						collapsed: true,
						items: [
							{
								text: '6.4.2.1 Instalação do Plugin de Controle de Conexão',
								link: '/07-security/04-security-plugins/02-connection-control-plugins/01-connection-control-plugin-installation.md',
							},
							{
								text: '6.4.2.2 Sistema de Plugin de Controle de Conexão e Variáveis de Status',
								link: '/07-security/04-security-plugins/02-connection-control-plugins/02-connection-control-plugin-system-and-status-variables.md',
							},
						],
						link: '/07-security/04-security-plugins/02-connection-control-plugins/index.md',
					},
					{
						text: '6.4.3 O Plugin de Validação de Senha',
						collapsed: true,
						items: [
							{
								text: '6.4.3.1 Instalação do Plugin de Validação de Senha',
								link: '/07-security/04-security-plugins/03-the-password-validation-plugin/01-password-validation-plugin-installation.md',
							},
							{
								text: '6.4.3.2 Opções e variáveis do plugin de validação de senha',
								link: '/07-security/04-security-plugins/03-the-password-validation-plugin/02-password-validation-plugin-options-and-variables.md',
							},
						],
						link: '/07-security/04-security-plugins/03-the-password-validation-plugin/index.md',
					},
					{
						text: '6.4.4 O Keyring do MySQL',
						collapsed: true,
						items: [
							{
								text: '6.4.4.1 Instalação do Plugin para Carteira de Chave',
								link: '/07-security/04-security-plugins/04-the-my-s-q-l-keyring/01-keyring-plugin-installation.md',
							},
							{
								text: '6.4.4.2 Usando o plugin de cartela de chaves baseado em arquivo keyring_file',
								link: '/07-security/04-security-plugins/04-the-my-s-q-l-keyring/02-using-the-keyring-file-file-based-keyring-plugin.md',
							},
							{
								text: '6.4.4.3 Usando o plugin de cartela de chaves criptografada com arquivo Encrypted File-Based Keyring',
								link: '/07-security/04-security-plugins/04-the-my-s-q-l-keyring/03-using-the-keyring-encrypted-file-encrypted-file-based-keyring-plugin.md',
							},
							{
								text: '6.4.4.4 Usando o plugin KMIP keyring_okv',
								link: '/07-security/04-security-plugins/04-the-my-s-q-l-keyring/04-using-the-keyring-okv-k-m-i-p-plugin.md',
							},
							{
								text: '6.4.4.5 Usando o plugin Amazon Web Services Keyring do keyring_aws',
								link: '/07-security/04-security-plugins/04-the-my-s-q-l-keyring/05-using-the-keyring-aws-amazon-web-services-keyring-plugin.md',
							},
							{
								text: '6.4.4.6 Tipos e comprimentos de chave de cartela de identificação suportados',
								link: '/07-security/04-security-plugins/04-the-my-s-q-l-keyring/06-supported-keyring-key-types-and-lengths.md',
							},
							{
								text: '6.4.4.7 Migrar chaves entre os keystores do Keychain',
								link: '/07-security/04-security-plugins/04-the-my-s-q-l-keyring/07-migrating-keys-between-keyring-keystores.md',
							},
							{
								text: '6.4.4.8 Funções de gerenciamento de chaves do porta-chaves de uso geral',
								link: '/07-security/04-security-plugins/04-the-my-s-q-l-keyring/08-general-purpose-keyring-key-management-functions.md',
							},
							{
								text: '6.4.4.9 Funções de Gerenciamento de Chaves do Carteiro Específicas aos Plugins',
								link: '/07-security/04-security-plugins/04-the-my-s-q-l-keyring/09-plugin-specific-keyring-key-management-functions.md',
							},
							{
								text: '6.4.4.10 Metadados do cartela de identificação',
								link: '/07-security/04-security-plugins/04-the-my-s-q-l-keyring/10-keyring-metadata.md',
							},
							{
								text: '6.4.4.11 Opções de comando do porta-chaves',
								link: '/07-security/04-security-plugins/04-the-my-s-q-l-keyring/11-keyring-command-options.md',
							},
							{
								text: '6.4.4.12 Variáveis do Sistema de Carteira de Chave',
								link: '/07-security/04-security-plugins/04-the-my-s-q-l-keyring/12-keyring-system-variables.md',
							},
						],
						link: '/07-security/04-security-plugins/04-the-my-s-q-l-keyring/index.md',
					},
					{
						text: '6.4.5 Auditoria do MySQL Enterprise',
						collapsed: true,
						items: [
							{
								text: '6.4.5.1 Elementos da Auditoria do MySQL Enterprise',
								link: '/07-security/04-security-plugins/05-my-s-q-l-enterprise-audit/01-elements-of-my-s-q-l-enterprise-audit.md',
							},
							{
								text: '6.4.5.2 Instalar ou desinstalar o MySQL Enterprise Audit',
								link: '/07-security/04-security-plugins/05-my-s-q-l-enterprise-audit/02-installing-or-uninstalling-my-s-q-l-enterprise-audit.md',
							},
							{
								text: '6.4.5.3 Considerações de segurança de auditoria do MySQL Enterprise',
								link: '/07-security/04-security-plugins/05-my-s-q-l-enterprise-audit/03-my-s-q-l-enterprise-audit-security-considerations.md',
							},
							{
								text: '6.4.5.4 Formatos de arquivo de registro de auditoria',
								link: '/07-security/04-security-plugins/05-my-s-q-l-enterprise-audit/04-audit-log-file-formats.md',
							},
							{
								text: '6.4.5.5 Configurando características de registro de auditoria',
								link: '/07-security/04-security-plugins/05-my-s-q-l-enterprise-audit/05-configuring-audit-logging-characteristics.md',
							},
							{
								text: '6.4.5.6 Leitura de arquivos de registro de auditoria',
								link: '/07-security/04-security-plugins/05-my-s-q-l-enterprise-audit/06-reading-audit-log-files.md',
							},
							{
								text: '6.4.5.7 Filtragem do Log de Auditoria',
								link: '/07-security/04-security-plugins/05-my-s-q-l-enterprise-audit/07-audit-log-filtering.md',
							},
							{
								text: '6.4.5.8 Escrever definições de filtro do log de auditoria',
								link: '/07-security/04-security-plugins/05-my-s-q-l-enterprise-audit/08-writing-audit-log-filter-definitions.md',
							},
							{
								text: '6.4.5.9 Desativar o registro de auditoria',
								link: '/07-security/04-security-plugins/05-my-s-q-l-enterprise-audit/09-disabling-audit-logging.md',
							},
							{
								text: '6.4.5.10 Filtro do Log de Auditoria no Modo Legado',
								link: '/07-security/04-security-plugins/05-my-s-q-l-enterprise-audit/10-legacy-mode-audit-log-filtering.md',
							},
							{
								text: '6.4.5.11 Referência do Log de Auditoria',
								link: '/07-security/04-security-plugins/05-my-s-q-l-enterprise-audit/11-audit-log-reference.md',
							},
							{
								text: '6.4.5.12 Restrições do Log de Auditoria',
								link: '/07-security/04-security-plugins/05-my-s-q-l-enterprise-audit/12-audit-log-restrictions.md',
							},
						],
						link: '/07-security/04-security-plugins/05-my-s-q-l-enterprise-audit/index.md',
					},
					{
						text: '6.4.6 Firewall Empresarial MySQL',
						collapsed: true,
						items: [
							{
								text: '6.4.6.1 Elementos do Firewall Empresarial MySQL',
								link: '/07-security/04-security-plugins/06-my-s-q-l-enterprise-firewall/01-elements-of-my-s-q-l-enterprise-firewall.md',
							},
							{
								text: '6.4.6.2 Instalar ou desinstalar o Firewall Empresarial MySQL',
								link: '/07-security/04-security-plugins/06-my-s-q-l-enterprise-firewall/02-installing-or-uninstalling-my-s-q-l-enterprise-firewall.md',
							},
							{
								text: '6.4.6.3 Uso do Firewall Empresarial MySQL',
								link: '/07-security/04-security-plugins/06-my-s-q-l-enterprise-firewall/03-using-my-s-q-l-enterprise-firewall.md',
							},
							{
								text: '6.4.6.4 Referência ao Firewall Empresarial MySQL',
								link: '/07-security/04-security-plugins/06-my-s-q-l-enterprise-firewall/04-my-s-q-l-enterprise-firewall-reference.md',
							},
						],
						link: '/07-security/04-security-plugins/06-my-s-q-l-enterprise-firewall/index.md',
					},
				],
				link: '/07-security/04-security-plugins/index.md',
			},
			{
				text: '6.5 Mascagem e desidentificação de dados da MySQL Enterprise',
				collapsed: true,
				items: [
					{
						text: '6.5.1 Elementos de Máscara e Desidentificação de Dados da MySQL Enterprise',
						link: '/07-security/05-my-s-q-l-enterprise-data-masking-and-de-identification/01-my-s-q-l-enterprise-data-masking-and-de-identification-elements.md',
					},
					{
						text: '6.5.2 Instalação ou Desinstalação da Mascagem e Desidentificação de Dados do MySQL Enterprise',
						link: '/07-security/05-my-s-q-l-enterprise-data-masking-and-de-identification/02-installing-or-uninstalling-my-s-q-l-enterprise-data-masking-and-de-identification.md',
					},
					{
						text: '6.5.3 Uso da Mascagem e Desidentificação de Dados do MySQL Enterprise',
						link: '/07-security/05-my-s-q-l-enterprise-data-masking-and-de-identification/03-using-my-s-q-l-enterprise-data-masking-and-de-identification.md',
					},
					{
						text: '6.5.4 Referência à função de mascaramento e desidentificação de dados da MySQL Enterprise',
						link: '/07-security/05-my-s-q-l-enterprise-data-masking-and-de-identification/04-my-s-q-l-enterprise-data-masking-and-de-identification-function-reference.md',
					},
					{
						text: '6.5.5 Descrições das funções de mascaramento e desidentificação de dados da MySQL Enterprise',
						link: '/07-security/05-my-s-q-l-enterprise-data-masking-and-de-identification/05-my-s-q-l-enterprise-data-masking-and-de-identification-function-descriptions.md',
					},
				],
				link: '/07-security/05-my-s-q-l-enterprise-data-masking-and-de-identification/index.md',
			},
			{
				text: '6.6. Criptografia da MySQL Enterprise',
				collapsed: true,
				items: [
					{
						text: '6.6.1 Instalação da Encriptação do MySQL Enterprise',
						link: '/07-security/06-my-s-q-l-enterprise-encryption/01-my-s-q-l-enterprise-encryption-installation.md',
					},
					{
						text: '6.6.2 Uso e exemplos de criptografia da MySQL Enterprise',
						link: '/07-security/06-my-s-q-l-enterprise-encryption/02-my-s-q-l-enterprise-encryption-usage-and-examples.md',
					},
					{
						text: '6.6.3 Referência da Função de Criptografia da MySQL Enterprise',
						link: '/07-security/06-my-s-q-l-enterprise-encryption/03-my-s-q-l-enterprise-encryption-function-reference.md',
					},
					{
						text: '6.6.4 Descrições das Funções de Criptografia do MySQL Enterprise',
						link: '/07-security/06-my-s-q-l-enterprise-encryption/04-my-s-q-l-enterprise-encryption-function-descriptions.md',
					},
				],
				link: '/07-security/06-my-s-q-l-enterprise-encryption/index.md',
			},
			{
				text: '6.7 SELinux',
				collapsed: true,
				items: [
					{
						text: '6.7.1 Verifique se o SELinux está ativado',
						link: '/07-security/07-se-linux/01-check-if-se-linux-is-enabled.md',
					},
					{
						text: '6.7.2 Mudando o modo SELinux',
						link: '/07-security/07-se-linux/02-changing-the-se-linux-mode.md',
					},
					{
						text: '6.7.3 Políticas do MySQL Server SELinux',
						link: '/07-security/07-se-linux/03-my-s-q-l-server-se-linux-policies.md',
					},
					{
						text: '6.7.4 Contexto de arquivo SELinux',
						link: '/07-security/07-se-linux/04-se-linux-file-context.md',
					},
					{
						text: '6.7.6 Solução de problemas do SELinux',
						link: '/07-security/07-se-linux/06-troubleshooting-se-linux.md',
					},
					{
						text: '6.7.5 Contexto de Porta TCP SELinux',
						collapsed: true,
						items: [
							{
								text: '6.7.5.1 Configurando o contexto da porta TCP para o mysqld',
								link: '/07-security/07-se-linux/05-se-linux-t-c-p-port-context/01-setting-the-t-c-p-port-context-for-mysqld.md',
							},
							{
								text: '6.7.5.2 Configurando o contexto da porta TCP para recursos do MySQL',
								link: '/07-security/07-se-linux/05-se-linux-t-c-p-port-context/02-setting-the-t-c-p-port-context-for-my-s-q-l-features.md',
							},
						],
						link: '/07-security/07-se-linux/05-se-linux-t-c-p-port-context/index.md',
					},
				],
				link: '/07-security/07-se-linux/index.md',
			},
		],
		link: '/07-security/index.md',
	},
	{
		text: 'Capítulo 7: Backup e Recuperação',
		collapsed: true,
		items: [
			{
				text: '7.1 Tipos de backup e recuperação',
				link: '/08-backup-and-recovery/01-backup-and-recovery-types.md',
			},
			{
				text: '7.2 Métodos de backup de banco de dados',
				link: '/08-backup-and-recovery/02-database-backup-methods.md',
			},
			{
				text: '7.3 Estratégia de backup e recuperação de exemplo',
				collapsed: true,
				items: [
					{
						text: '7.3.1 Estabelecimento de uma Política de Backup',
						link: '/08-backup-and-recovery/03-example-backup-and-recovery-strategy/01-establishing-a-backup-policy.md',
					},
					{
						text: '7.3.2 Uso de backups para recuperação',
						link: '/08-backup-and-recovery/03-example-backup-and-recovery-strategy/02-using-backups-for-recovery.md',
					},
					{
						text: '7.3.3 Resumo da Estratégia de Backup',
						link: '/08-backup-and-recovery/03-example-backup-and-recovery-strategy/03-backup-strategy-summary.md',
					},
				],
				link: '/08-backup-and-recovery/03-example-backup-and-recovery-strategy/index.md',
			},
			{
				text: '7.4 Usando mysqldump para backups',
				collapsed: true,
				items: [
					{
						text: '7.4.1 Arquivamento de dados no formato SQL com mysqldump',
						link: '/08-backup-and-recovery/04-using-mysqldump-for-backups/01-dumping-data-in-s-q-l-format-with-mysqldump.md',
					},
					{
						text: '7.4.2 Recarga de backups no formato SQL',
						link: '/08-backup-and-recovery/04-using-mysqldump-for-backups/02-reloading-sql-format-backups.md',
					},
					{
						text: '7.4.3. Lançar dados no formato de texto delimitado com mysqldump',
						link: '/08-backup-and-recovery/04-using-mysqldump-for-backups/03-dumping-data-in-delimited-text-format-with-mysqldump.md',
					},
					{
						text: '7.4.4 Recarga de backups no formato de texto delimitado',
						link: '/08-backup-and-recovery/04-using-mysqldump-for-backups/04-reloading-delimited-text-format-backups.md',
					},
					{
						text: '7.4.5 Dicas do mysqldump',
						collapsed: true,
						items: [
							{
								text: '7.4.5.1 Fazer uma cópia de um banco de dados',
								link: '/08-backup-and-recovery/04-using-mysqldump-for-backups/05-mysqldump-tips/01-making-a-copy-of-a-database.md',
							},
							{
								text: '7.4.5.2 Copiar uma base de dados de um servidor para outro',
								link: '/08-backup-and-recovery/04-using-mysqldump-for-backups/05-mysqldump-tips/02-copy-a-database-from-one-server-to-another.md',
							},
							{
								text: '7.4.5.3 Lançamento de programas armazenados',
								link: '/08-backup-and-recovery/04-using-mysqldump-for-backups/05-mysqldump-tips/03-dumping-stored-programs.md',
							},
							{
								text: '7.4.5.4 Definições e conteúdo da tabela de descarte separadamente',
								link: '/08-backup-and-recovery/04-using-mysqldump-for-backups/05-mysqldump-tips/04-dumping-table-definitions-and-content-separately.md',
							},
							{
								text: '7.4.5.5 Usar mysqldump para testar incompatibilidades de atualização',
								link: '/08-backup-and-recovery/04-using-mysqldump-for-backups/05-mysqldump-tips/05-using-mysqldump-to-test-for-upgrade-incompatibilities.md',
							},
						],
						link: '/08-backup-and-recovery/04-using-mysqldump-for-backups/05-mysqldump-tips/index.md',
					},
				],
				link: '/08-backup-and-recovery/04-using-mysqldump-for-backups/index.md',
			},
			{
				text: '7.5 Recuperação pontual (incremental)',
				collapsed: true,
				items: [
					{
						text: '7.5.1 Recuperação no Ponto de Tempo Usando Log de Binário',
						link: '/08-backup-and-recovery/05-point-in-time-incremental-recovery/01-point-in-time-recovery-using-binary-log.md',
					},
					{
						text: '7.5.2 Recuperação no Ponto de Tempo Usando Posições de Eventos',
						link: '/08-backup-and-recovery/05-point-in-time-incremental-recovery/02-point-in-time-recovery-using-event-positions.md',
					},
				],
				link: '/08-backup-and-recovery/05-point-in-time-incremental-recovery/index.md',
			},
			{
				text: '7.6 Manutenção de tabelas MyISAM e recuperação após falhas',
				collapsed: true,
				items: [
					{
						text: '7.6.1 Usando o myisamchk para recuperação de falhas',
						link: '/08-backup-and-recovery/06-my-i-s-a-m-table-maintenance-and-crash-recovery/01-using-myisamchk-for-crash-recovery.md',
					},
					{
						text: '7.6.2 Como verificar as tabelas MyISAM em busca de erros',
						link: '/08-backup-and-recovery/06-my-i-s-a-m-table-maintenance-and-crash-recovery/02-how-to-check-my-i-s-a-m-tables-for-errors.md',
					},
					{
						text: '7.6.3 Como reparar as tabelas MyISAM',
						link: '/08-backup-and-recovery/06-my-i-s-a-m-table-maintenance-and-crash-recovery/03-how-to-repair-my-i-s-a-m-tables.md',
					},
					{
						text: '7.6.4 Otimização de Tabelas MyISAM',
						link: '/08-backup-and-recovery/06-my-i-s-a-m-table-maintenance-and-crash-recovery/04-my-i-s-a-m-table-optimization.md',
					},
					{
						text: '7.6.5 Configurando um cronograma de manutenção de tabela MyISAM',
						link: '/08-backup-and-recovery/06-my-i-s-a-m-table-maintenance-and-crash-recovery/05-setting-up-a-my-i-s-a-m-table-maintenance-schedule.md',
					},
				],
				link: '/08-backup-and-recovery/06-my-i-s-a-m-table-maintenance-and-crash-recovery/index.md',
			},
		],
		link: '/08-backup-and-recovery/index.md',
	},
	{
		text: 'Capítulo 8: Otimização',
		collapsed: true,
		items: [
			{
				text: '8.1 Visão geral da otimização',
				link: '/09-optimization/01-optimization-overview.md',
			},
			{
				text: '8.7 Otimização para tabelas de MEMORY',
				link: '/09-optimization/07-optimizing-for-m-e-m-o-r-y-tables.md',
			},
			{
				text: '8.2 Otimização de instruções SQL',
				collapsed: true,
				items: [
					{
						text: '8.2.3 Otimizando consultas do INFORMATION_SCHEMA',
						link: '/09-optimization/02-optimizing-s-q-l-statements/03-optimizing-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-queries.md',
					},
					{
						text: '8.2.5 Otimizando privilégios do banco de dados',
						link: '/09-optimization/02-optimizing-s-q-l-statements/05-optimizing-database-privileges.md',
					},
					{
						text: '8.2.6 Outras dicas de otimização',
						link: '/09-optimization/02-optimizing-s-q-l-statements/06-other-optimization-tips.md',
					},
					{
						text: '8.2.1 Otimizando instruções SELECT',
						collapsed: true,
						items: [
							{
								text: '8.2.1.1 Otimização da cláusula WHERE',
								link: '/09-optimization/02-optimizing-s-q-l-statements/01-optimizing-s-e-l-e-c-t-statements/01-w-h-e-r-e-clause-optimization.md',
							},
							{
								text: '8.2.1.2 Otimização da Alcance',
								link: '/09-optimization/02-optimizing-s-q-l-statements/01-optimizing-s-e-l-e-c-t-statements/02-range-optimization.md',
							},
							{
								text: '8.2.1.3 Otimização da Mesclagem de Índices',
								link: '/09-optimization/02-optimizing-s-q-l-statements/01-optimizing-s-e-l-e-c-t-statements/03-index-merge-optimization.md',
							},
							{
								text: '8.2.1.4 Otimização da Depressão do Estado do Motor',
								link: '/09-optimization/02-optimizing-s-q-l-statements/01-optimizing-s-e-l-e-c-t-statements/04-engine-condition-pushdown-optimization.md',
							},
							{
								text: '8.2.1.5 Otimização da empilhamento da condição do índice',
								link: '/09-optimization/02-optimizing-s-q-l-statements/01-optimizing-s-e-l-e-c-t-statements/05-index-condition-pushdown-optimization.md',
							},
							{
								text: '8.2.1.6 Algoritmos de Conjunção com Loop Aninhado',
								link: '/09-optimization/02-optimizing-s-q-l-statements/01-optimizing-s-e-l-e-c-t-statements/06-nested-loop-join-algorithms.md',
							},
							{
								text: '8.2.1.7 Otimização de Conexão Aninhada',
								link: '/09-optimization/02-optimizing-s-q-l-statements/01-optimizing-s-e-l-e-c-t-statements/07-nested-join-optimization.md',
							},
							{
								text: '8.2.1.8 Otimização de Conexão Externa',
								link: '/09-optimization/02-optimizing-s-q-l-statements/01-optimizing-s-e-l-e-c-t-statements/08-outer-join-optimization.md',
							},
							{
								text: '8.2.1.9 Simplificação da Conjunção Externa',
								link: '/09-optimization/02-optimizing-s-q-l-statements/01-optimizing-s-e-l-e-c-t-statements/09-outer-join-simplification.md',
							},
							{
								text: '8.2.1.10 Otimização da leitura em várias faixas de amplitude',
								link: '/09-optimization/02-optimizing-s-q-l-statements/01-optimizing-s-e-l-e-c-t-statements/10-multi-range-read-optimization.md',
							},
							{
								text: '8.2.1.11 Conexões de junção em laço aninhado e acesso a chave em lote',
								link: '/09-optimization/02-optimizing-s-q-l-statements/01-optimizing-s-e-l-e-c-t-statements/11-block-nested-loop-and-batched-key-access-joins.md',
							},
							{
								text: '8.2.1.12 Filtragem de Condições',
								link: '/09-optimization/02-optimizing-s-q-l-statements/01-optimizing-s-e-l-e-c-t-statements/12-condition-filtering.md',
							},
							{
								text: '8.2.1.13 Otimização IS NULL',
								link: '/09-optimization/02-optimizing-s-q-l-statements/01-optimizing-s-e-l-e-c-t-statements/13-i-s-n-u-l-l-optimization.md',
							},
							{
								text: '8.2.1.14 ORDEM POR Otimização',
								link: '/09-optimization/02-optimizing-s-q-l-statements/01-optimizing-s-e-l-e-c-t-statements/14-o-r-d-e-r-b-y-optimization.md',
							},
							{
								text: '8.2.1.15 Otimização por GRUPO',
								link: '/09-optimization/02-optimizing-s-q-l-statements/01-optimizing-s-e-l-e-c-t-statements/15-g-r-o-u-p-b-y-optimization.md',
							},
							{
								text: '8.2.1.16 Otimização DISTINCT',
								link: '/09-optimization/02-optimizing-s-q-l-statements/01-optimizing-s-e-l-e-c-t-statements/16-d-i-s-t-i-n-c-t-optimization.md',
							},
							{
								text: '8.2.1.17 Otimização da consulta LIMIT',
								link: '/09-optimization/02-optimizing-s-q-l-statements/01-optimizing-s-e-l-e-c-t-statements/17-l-i-m-i-t-query-optimization.md',
							},
							{
								text: '8.2.1.18 Otimização da Chamada de Função',
								link: '/09-optimization/02-optimizing-s-q-l-statements/01-optimizing-s-e-l-e-c-t-statements/18-function-call-optimization.md',
							},
							{
								text: '8.2.1.19 Otimização da expressão do construtor de linha',
								link: '/09-optimization/02-optimizing-s-q-l-statements/01-optimizing-s-e-l-e-c-t-statements/19-row-constructor-expression-optimization.md',
							},
							{
								text: '8.2.1.20 Evitar varreduras completas da tabela',
								link: '/09-optimization/02-optimizing-s-q-l-statements/01-optimizing-s-e-l-e-c-t-statements/20-avoiding-full-table-scans.md',
							},
						],
						link: '/09-optimization/02-optimizing-s-q-l-statements/01-optimizing-s-e-l-e-c-t-statements/index.md',
					},
					{
						text: '8.2.2 Otimizando subconsultas, tabelas derivadas e referências de visualização',
						collapsed: true,
						items: [
							{
								text: '8.2.2.1 Otimização de subconsultas, tabelas derivadas e referências de visualizações com transformações de semijoin',
								link: '/09-optimization/02-optimizing-s-q-l-statements/02-optimizing-subqueries-derived-tables-and-view-references/01-optimizing-subqueries-derived-tables-and-view-references-with-semijoin-transformations.md',
							},
							{
								text: '8.2.2.2 Otimizando subconsultas com materialização',
								link: '/09-optimization/02-optimizing-s-q-l-statements/02-optimizing-subqueries-derived-tables-and-view-references/02-optimizing-subqueries-with-materialization.md',
							},
							{
								text: '8.2.2.3 Otimizando subconsultas com a estratégia EXISTS',
								link: '/09-optimization/02-optimizing-s-q-l-statements/02-optimizing-subqueries-derived-tables-and-view-references/03-optimizing-subqueries-with-the-e-x-i-s-t-s-strategy.md',
							},
							{
								text: '8.2.2.4 Otimização de tabelas derivadas e referências de visualizações com fusão ou materialização',
								link: '/09-optimization/02-optimizing-s-q-l-statements/02-optimizing-subqueries-derived-tables-and-view-references/04-optimizing-derived-tables-and-view-references-with-merging-or-materialization.md',
							},
						],
						link: '/09-optimization/02-optimizing-s-q-l-statements/02-optimizing-subqueries-derived-tables-and-view-references/index.md',
					},
					{
						text: '8.2.4 Otimização das declarações de alteração de dados',
						collapsed: true,
						items: [
							{
								text: '8.2.4.1 Otimizando instruções INSERT',
								link: '/09-optimization/02-optimizing-s-q-l-statements/04-optimizing-data-change-statements/01-optimizing-i-n-s-e-r-t-statements.md',
							},
							{
								text: '8.2.4.2. Otimizando declarações UPDATE',
								link: '/09-optimization/02-optimizing-s-q-l-statements/04-optimizing-data-change-statements/02-optimizing-u-p-d-a-t-e-statements.md',
							},
							{
								text: '8.2.4.3 Otimizando instruções DELETE',
								link: '/09-optimization/02-optimizing-s-q-l-statements/04-optimizing-data-change-statements/03-optimizing-d-e-l-e-t-e-statements.md',
							},
						],
						link: '/09-optimization/02-optimizing-s-q-l-statements/04-optimizing-data-change-statements/index.md',
					},
				],
				link: '/09-optimization/02-optimizing-s-q-l-statements/index.md',
			},
			{
				text: '8.3 Otimização e índices',
				collapsed: true,
				items: [
					{
						text: '8.3.1 Como o MySQL usa índices',
						link: '/09-optimization/03-optimization-and-indexes/01-how-my-s-q-l-uses-indexes.md',
					},
					{
						text: '8.3.2 Otimização da Chave Primária',
						link: '/09-optimization/03-optimization-and-indexes/02-primary-key-optimization.md',
					},
					{
						text: '8.3.3 Otimização da Chave Estrangeira',
						link: '/09-optimization/03-optimization-and-indexes/03-foreign-key-optimization.md',
					},
					{
						text: '8.3.4 Índices de Colunas',
						link: '/09-optimization/03-optimization-and-indexes/04-column-indexes.md',
					},
					{
						text: '8.3.5 Índices de múltiplas colunas',
						link: '/09-optimization/03-optimization-and-indexes/05-multiple-column-indexes.md',
					},
					{
						text: '8.3.6 Verificar o uso do índice',
						link: '/09-optimization/03-optimization-and-indexes/06-verifying-index-usage.md',
					},
					{
						text: '8.3.7 Coleta de estatísticas de índices InnoDB e MyISAM',
						link: '/09-optimization/03-optimization-and-indexes/07-inno-d-b-and-my-i-s-a-m-index-statistics-collection.md',
					},
					{
						text: '8.3.8 Comparação de índices B-Tree e Hash',
						link: '/09-optimization/03-optimization-and-indexes/08-comparison-of-b-tree-and-hash-indexes.md',
					},
					{
						text: '8.3.9 Uso de extensões do índice',
						link: '/09-optimization/03-optimization-and-indexes/09-use-of-index-extensions.md',
					},
					{
						text: '8.3.10 O otimizador usa índices de coluna gerados',
						link: '/09-optimization/03-optimization-and-indexes/10-optimizer-use-of-generated-column-indexes.md',
					},
					{
						text: '8.3.11 Busca indexada em colunas TIMESTAMP',
						link: '/09-optimization/03-optimization-and-indexes/11-indexed-lookups-from-t-i-m-e-s-t-a-m-p-columns.md',
					},
				],
				link: '/09-optimization/03-optimization-and-indexes/index.md',
			},
			{
				text: '8.4. Otimizando a Estrutura do Banco de Dados',
				collapsed: true,
				items: [
					{
						text: '8.4.1 Otimização do tamanho dos dados',
						link: '/09-optimization/04-optimizing-database-structure/01-optimizing-data-size.md',
					},
					{
						text: '8.4.4 Uso de Tabela Temporária Interna no MySQL',
						link: '/09-optimization/04-optimizing-database-structure/04-internal-temporary-table-use-in-my-sql.md',
					},
					{
						text: '8.4.5 Limites de número de bancos de dados e tabelas',
						link: '/09-optimization/04-optimizing-database-structure/05-limits-on-number-of-databases-and-tables.md',
					},
					{
						text: '8.4.6 Limites de tamanho da tabela',
						link: '/09-optimization/04-optimizing-database-structure/06-limits-on-table-size.md',
					},
					{
						text: '8.4.7 Limites de contagem de colunas de tabela e tamanho de linha',
						link: '/09-optimization/04-optimizing-database-structure/07-limits-on-table-column-count-and-row-size.md',
					},
					{
						text: '8.4.2 Otimizando tipos de dados do MySQL',
						collapsed: true,
						items: [
							{
								text: '8.4.2.1 Otimização para dados numéricos',
								link: '/09-optimization/04-optimizing-database-structure/02-optimizing-my-s-q-l-data-types/01-optimizing-for-numeric-data.md',
							},
							{
								text: '8.4.2.2 Otimização para tipos de caracteres e strings',
								link: '/09-optimization/04-optimizing-database-structure/02-optimizing-my-s-q-l-data-types/02-optimizing-for-character-and-string-types.md',
							},
							{
								text: '8.4.2.3 Otimização para tipos de BLOB',
								link: '/09-optimization/04-optimizing-database-structure/02-optimizing-my-s-q-l-data-types/03-optimizing-for-b-l-o-b-types.md',
							},
							{
								text: '8.4.2.4 Usando a ANÁLISE DE PROCEDIMENTOS',
								link: '/09-optimization/04-optimizing-database-structure/02-optimizing-my-s-q-l-data-types/04-using-p-r-o-c-e-d-u-r-e-analyse.md',
							},
						],
						link: '/09-optimization/04-optimizing-database-structure/02-optimizing-my-s-q-l-data-types/index.md',
					},
					{
						text: '8.4.3 Otimização para muitas tabelas',
						collapsed: true,
						items: [
							{
								text: '8.4.3.1 Como o MySQL abre e fecha tabelas',
								link: '/09-optimization/04-optimizing-database-structure/03-optimizing-for-many-tables/01-how-my-s-q-l-opens-and-closes-tables.md',
							},
							{
								text: '8.4.3.2 Desvantagens de criar muitas tabelas na mesma base de dados',
								link: '/09-optimization/04-optimizing-database-structure/03-optimizing-for-many-tables/02-disadvantages-of-creating-many-tables-in-the-same-database.md',
							},
						],
						link: '/09-optimization/04-optimizing-database-structure/03-optimizing-for-many-tables/index.md',
					},
				],
				link: '/09-optimization/04-optimizing-database-structure/index.md',
			},
			{
				text: '8.5. Otimização para tabelas InnoDB',
				collapsed: true,
				items: [
					{
						text: '8.5.1 Otimizando o Layout de Armazenamento para Tabelas InnoDB',
						link: '/09-optimization/05-optimizing-for-inno-d-b-tables/01-optimizing-storage-layout-for-inno-d-b-tables.md',
					},
					{
						text: '8.5.2 Otimização da Gestão de Transações InnoDB',
						link: '/09-optimization/05-optimizing-for-inno-d-b-tables/02-optimizing-inno-d-b-transaction-management.md',
					},
					{
						text: '8.5.3 Otimização de Transações de Leitura Apenas de Leitura do InnoDB',
						link: '/09-optimization/05-optimizing-for-inno-d-b-tables/03-optimizing-inno-d-b-read-only-transactions.md',
					},
					{
						text: '8.5.4 Otimizando o registro de reinicialização do InnoDB',
						link: '/09-optimization/05-optimizing-for-inno-d-b-tables/04-optimizing-inno-d-b-redo-logging.md',
					},
					{
						text: '8.5.5 Carregamento de dados em lote para tabelas InnoDB',
						link: '/09-optimization/05-optimizing-for-inno-d-b-tables/05-bulk-data-loading-for-inno-d-b-tables.md',
					},
					{
						text: '8.5.6 Otimizando consultas InnoDB',
						link: '/09-optimization/05-optimizing-for-inno-d-b-tables/06-optimizing-inno-d-b-queries.md',
					},
					{
						text: '8.5.7 Otimizando operações de DDL do InnoDB',
						link: '/09-optimization/05-optimizing-for-inno-d-b-tables/07-optimizing-inno-d-b-d-d-l-operations.md',
					},
					{
						text: '8.5.8 Otimizando o I/O de disco do InnoDB',
						link: '/09-optimization/05-optimizing-for-inno-d-b-tables/08-optimizing-inno-d-b-disk-io.md',
					},
					{
						text: '8.5.9 Otimizando as variáveis de configuração do InnoDB',
						link: '/09-optimization/05-optimizing-for-inno-d-b-tables/09-optimizing-inno-d-b-configuration-variables.md',
					},
					{
						text: '8.5.10 Otimizando o InnoDB para sistemas com muitas tabelas',
						link: '/09-optimization/05-optimizing-for-inno-d-b-tables/10-optimizing-inno-d-b-for-systems-with-many-tables.md',
					},
				],
				link: '/09-optimization/05-optimizing-for-inno-d-b-tables/index.md',
			},
			{
				text: '8.6 Otimização para tabelas MyISAM',
				collapsed: true,
				items: [
					{
						text: '8.6.1 Otimizando consultas MyISAM',
						link: '/09-optimization/06-optimizing-for-my-i-s-a-m-tables/01-optimizing-my-i-s-a-m-queries.md',
					},
					{
						text: '8.6.2 Carregamento de dados em lote para tabelas MyISAM',
						link: '/09-optimization/06-optimizing-for-my-i-s-a-m-tables/02-bulk-data-loading-for-my-i-s-a-m-tables.md',
					},
					{
						text: '8.6.3 Otimizando as declarações da Tabela de Reparo',
						link: '/09-optimization/06-optimizing-for-my-i-s-a-m-tables/03-optimizing-r-e-p-a-i-r-t-a-b-l-e-statements.md',
					},
				],
				link: '/09-optimization/06-optimizing-for-my-i-s-a-m-tables/index.md',
			},
			{
				text: '8.8 Entendendo o Plano de Execução da Consulta',
				collapsed: true,
				items: [
					{
						text: '8.8.1 Otimizando Consultas com EXPLAIN',
						link: '/09-optimization/08-understanding-the-query-execution-plan/01-optimizing-queries-with-explain.md',
					},
					{
						text: '8.8.2 Formato de Saída Explicação',
						link: '/09-optimization/08-understanding-the-query-execution-plan/02-e-x-p-l-a-i-n-output-format.md',
					},
					{
						text: '8.8.3 Formato de saída do EXPLAIN estendido',
						link: '/09-optimization/08-understanding-the-query-execution-plan/03-extended-e-x-p-l-a-i-n-output-format.md',
					},
					{
						text: '8.8.4 Obter informações do plano de execução para uma conexão nomeada',
						link: '/09-optimization/08-understanding-the-query-execution-plan/04-obtaining-execution-plan-information-for-a-named-connection.md',
					},
					{
						text: '8.8.5 Estimativa do desempenho da consulta',
						link: '/09-optimization/08-understanding-the-query-execution-plan/05-estimating-query-performance.md',
					},
				],
				link: '/09-optimization/08-understanding-the-query-execution-plan/index.md',
			},
			{
				text: '8.9 Controlar o otimizador de consultas',
				collapsed: true,
				items: [
					{
						text: '8.9.1 Controle da Avaliação do Plano de Consulta',
						link: '/09-optimization/09-controlling-the-query-optimizer/01-controlling-query-plan-evaluation.md',
					},
					{
						text: '8.9.2 Otimizações comutadas',
						link: '/09-optimization/09-controlling-the-query-optimizer/02-switchable-optimizations.md',
					},
					{
						text: '8.9.3 Dicas de otimização',
						link: '/09-optimization/09-controlling-the-query-optimizer/03-optimizer-hints.md',
					},
					{
						text: '8.9.4 Dicas de índice',
						link: '/09-optimization/09-controlling-the-query-optimizer/04-index-hints.md',
					},
					{
						text: '8.9.5 Modelo de Custo do Otimizador',
						link: '/09-optimization/09-controlling-the-query-optimizer/05-the-optimizer-cost-model.md',
					},
				],
				link: '/09-optimization/09-controlling-the-query-optimizer/index.md',
			},
			{
				text: '8.10 Bufferamento e Caching',
				collapsed: true,
				items: [
					{
						text: '8.10.1 Otimização do Pool de Buffer do InnoDB',
						link: '/09-optimization/10-buffering-and-caching/01-inno-d-b-buffer-pool-optimization.md',
					},
					{
						text: '8.10.4 Caching de Declarações Preparadas e Programas Armazenados',
						link: '/09-optimization/10-buffering-and-caching/04-caching-of-prepared-statements-and-stored-programs.md',
					},
					{
						text: '8.10.2 Cache de Chave MyISAM',
						collapsed: true,
						items: [
							{
								text: '8.10.2.1 Acesso à Cache de Chave Compartilhada',
								link: '/09-optimization/10-buffering-and-caching/02-the-my-i-s-a-m-key-cache/01-shared-key-cache-access.md',
							},
							{
								text: '8.10.2.2 Caches de Chave Múltiplos',
								link: '/09-optimization/10-buffering-and-caching/02-the-my-i-s-a-m-key-cache/02-multiple-key-caches.md',
							},
							{
								text: '8.10.2.3 Estratégia de Inserção no Ponto Médio',
								link: '/09-optimization/10-buffering-and-caching/02-the-my-i-s-a-m-key-cache/03-midpoint-insertion-strategy.md',
							},
							{
								text: '8.10.2.4 Pré-carregamento do índice',
								link: '/09-optimization/10-buffering-and-caching/02-the-my-i-s-a-m-key-cache/04-index-preloading.md',
							},
							{
								text: '8.10.2.5 Tamanho da chave do bloco de cache',
								link: '/09-optimization/10-buffering-and-caching/02-the-my-i-s-a-m-key-cache/05-key-cache-block-size.md',
							},
							{
								text: '8.10.2.6 Reestruturação de um Cache Principal',
								link: '/09-optimization/10-buffering-and-caching/02-the-my-i-s-a-m-key-cache/06-restructuring-a-key-cache.md',
							},
						],
						link: '/09-optimization/10-buffering-and-caching/02-the-my-i-s-a-m-key-cache/index.md',
					},
					{
						text: '8.10.3 Cache de consultas MySQL',
						collapsed: true,
						items: [
							{
								text: '8.10.3.1 Como o Cache de Consultas Funciona',
								link: '/09-optimization/10-buffering-and-caching/03-the-my-s-q-l-query-cache/01-how-the-query-cache-operates.md',
							},
							{
								text: '8.10.3.2 Opções de cache de consulta SELECT',
								link: '/09-optimization/10-buffering-and-caching/03-the-my-s-q-l-query-cache/02-query-cache-s-e-l-e-c-t-options.md',
							},
							{
								text: '8.10.3.3 Configuração do Cache de Consulta',
								link: '/09-optimization/10-buffering-and-caching/03-the-my-s-q-l-query-cache/03-query-cache-configuration.md',
							},
							{
								text: '8.10.3.4 Verificar o status e a manutenção do cache de consultas',
								link: '/09-optimization/10-buffering-and-caching/03-the-my-s-q-l-query-cache/04-query-cache-status-and-maintenance.md',
							},
						],
						link: '/09-optimization/10-buffering-and-caching/03-the-my-s-q-l-query-cache/index.md',
					},
				],
				link: '/09-optimization/10-buffering-and-caching/index.md',
			},
			{
				text: '8.11 Otimização das operações de bloqueio',
				collapsed: true,
				items: [
					{
						text: '8.11.1 Métodos de bloqueio interno',
						link: '/09-optimization/11-optimizing-locking-operations/01-internal-locking-methods.md',
					},
					{
						text: '8.11.2 Problemas com o bloqueio de tabelas',
						link: '/09-optimization/11-optimizing-locking-operations/02-table-locking-issues.md',
					},
					{
						text: '8.11.3 Inserções Concorrentes',
						link: '/09-optimization/11-optimizing-locking-operations/03-concurrent-inserts.md',
					},
					{
						text: '8.11.4 Bloqueio de metadados',
						link: '/09-optimization/11-optimizing-locking-operations/04-metadata-locking.md',
					},
					{
						text: '8.11.5 Bloqueio Externo',
						link: '/09-optimization/11-optimizing-locking-operations/05-external-locking.md',
					},
				],
				link: '/09-optimization/11-optimizing-locking-operations/index.md',
			},
			{
				text: '8.12. Otimizando o servidor MySQL',
				collapsed: true,
				items: [
					{
						text: '8.12.1 Fatores do sistema',
						link: '/09-optimization/12-optimizing-the-my-s-q-l-server/01-system-factors.md',
					},
					{
						text: '8.12.2 Otimização do I/O de disco',
						link: '/09-optimization/12-optimizing-the-my-s-q-l-server/02-optimizing-disk-io.md',
					},
					{
						text: '8.12.3 Usando Links Simbólicos',
						collapsed: true,
						items: [
							{
								text: '8.12.3.1 Uso de Links Simbólicos para Bancos de Dados no Unix',
								link: '/09-optimization/12-optimizing-the-my-s-q-l-server/03-using-symbolic-links/01-using-symbolic-links-for-databases-on-unix.md',
							},
							{
								text: '8.12.3.2 Usar Links Simbólicos para Tabelas MyISAM no Unix',
								link: '/09-optimization/12-optimizing-the-my-s-q-l-server/03-using-symbolic-links/02-using-symbolic-links-for-my-i-s-a-m-tables-on-unix.md',
							},
							{
								text: '8.12.3.3 Uso de Links Simbólicos para Bancos de Dados no Windows',
								link: '/09-optimization/12-optimizing-the-my-s-q-l-server/03-using-symbolic-links/03-using-symbolic-links-for-databases-on-windows.md',
							},
						],
						link: '/09-optimization/12-optimizing-the-my-s-q-l-server/03-using-symbolic-links/index.md',
					},
					{
						text: '8.12.4 Otimizando o uso da memória',
						collapsed: true,
						items: [
							{
								text: '8.12.4.1 Como o MySQL usa a memória',
								link: '/09-optimization/12-optimizing-the-my-s-q-l-server/04-optimizing-memory-use/01-how-my-s-q-l-uses-memory.md',
							},
							{
								text: '8.12.4.2 Monitoramento do uso de memória do MySQL',
								link: '/09-optimization/12-optimizing-the-my-s-q-l-server/04-optimizing-memory-use/02-monitoring-my-s-q-l-memory-usage.md',
							},
							{
								text: '8.12.4.3 Habilitar o suporte para páginas grandes',
								link: '/09-optimization/12-optimizing-the-my-s-q-l-server/04-optimizing-memory-use/03-enabling-large-page-support.md',
							},
						],
						link: '/09-optimization/12-optimizing-the-my-s-q-l-server/04-optimizing-memory-use/index.md',
					},
				],
				link: '/09-optimization/12-optimizing-the-my-s-q-l-server/index.md',
			},
			{
				text: '8.13 Medição de Desempenho (Benchmarking)',
				collapsed: true,
				items: [
					{
						text: '8.13.1 Medindo a Velocidade de Expressões e Funções',
						link: '/09-optimization/13-measuring-performance-benchmarking/01-measuring-the-speed-of-expressions-and-functions.md',
					},
					{
						text: '8.13.2 Usar seus próprios critérios de referência',
						link: '/09-optimization/13-measuring-performance-benchmarking/02-using-your-own-benchmarks.md',
					},
					{
						text: '8.13.3 Medindo o desempenho com o performance_schema',
						link: '/09-optimization/13-measuring-performance-benchmarking/03-measuring-performance-with-performance-schema.md',
					},
				],
				link: '/09-optimization/13-measuring-performance-benchmarking/index.md',
			},
			{
				text: '8.14 Análise das informações do thread (processo) do servidor',
				collapsed: true,
				items: [
					{
						text: '8.14.1 Acessar a Lista de Processos',
						link: '/09-optimization/14-examining-server-thread-process-information/01-accessing-the-process-list.md',
					},
					{
						text: '8.14.2 Valores dos comandos de thread',
						link: '/09-optimization/14-examining-server-thread-process-information/02-thread-command-values.md',
					},
					{
						text: '8.14.3 Estados gerais de fios',
						link: '/09-optimization/14-examining-server-thread-process-information/03-general-thread-states.md',
					},
					{
						text: '8.14.4 Estados de threads do cache de consultas',
						link: '/09-optimization/14-examining-server-thread-process-information/04-query-cache-thread-states.md',
					},
					{
						text: '8.14.5 Estados de fios de fonte de replicação',
						link: '/09-optimization/14-examining-server-thread-process-information/05-replication-source-thread-states.md',
					},
					{
						text: '8.14.6 Estados de Threads de E/S de Replicação Replica',
						link: '/09-optimization/14-examining-server-thread-process-information/06-replication-replica-i-o-thread-states.md',
					},
					{
						text: '8.14.7 Replicação Estados de thread de replicação SQL',
						link: '/09-optimization/14-examining-server-thread-process-information/07-replication-replica-s-q-l-thread-states.md',
					},
					{
						text: '8.14.8 Estados de Conexão de Replicação de Fila de Conexão de Replicação',
						link: '/09-optimization/14-examining-server-thread-process-information/08-replication-replica-connection-thread-states.md',
					},
					{
						text: '8.14.9 Estados de fios de clúster do NDB',
						link: '/09-optimization/14-examining-server-thread-process-information/09-n-d-b-cluster-thread-states.md',
					},
					{
						text: '8.14.10 Estados de fios do planejador de eventos',
						link: '/09-optimization/14-examining-server-thread-process-information/10-event-scheduler-thread-states.md',
					},
				],
				link: '/09-optimization/14-examining-server-thread-process-information/index.md',
			},
			{
				text: '8.15 Rastreamento do otimizador',
				collapsed: true,
				items: [
					{
						text: '8.15.1 Uso típico',
						link: '/09-optimization/15-tracing-the-optimizer/01-typical-usage.md',
					},
					{
						text: '8.15.2 Variáveis do sistema que controlam o rastreamento',
						link: '/09-optimization/15-tracing-the-optimizer/02-system-variables-controlling-tracing.md',
					},
					{
						text: '8.15.3 Declarações rastreáveis',
						link: '/09-optimization/15-tracing-the-optimizer/03-traceable-statements.md',
					},
					{
						text: '8.15.4 Limpeza da trilha de ajuste',
						link: '/09-optimization/15-tracing-the-optimizer/04-tuning-trace-purging.md',
					},
					{
						text: '8.15.5 Rastreamento do uso da memória',
						link: '/09-optimization/15-tracing-the-optimizer/05-tracing-memory-usage.md',
					},
					{
						text: '8.15.6 Verificação de privilégios',
						link: '/09-optimization/15-tracing-the-optimizer/06-privilege-checking.md',
					},
					{
						text: '8.15.7 Interação com a opção --debug',
						link: '/09-optimization/15-tracing-the-optimizer/07-interaction-with-the-debug-option.md',
					},
					{
						text: '8.15.8 A variável de sistema optimizer_trace',
						link: '/09-optimization/15-tracing-the-optimizer/08-the-optimizer-trace-system-variable.md',
					},
					{
						text: '8.15.9 A variável de sistema end_markers_in_json',
						link: '/09-optimization/15-tracing-the-optimizer/09-the-end-markers-in-json-system-variable.md',
					},
					{
						text: '8.15.10 Selecionando as características do otimizador para rastrear',
						link: '/09-optimization/15-tracing-the-optimizer/10-selecting-optimizer-features-to-trace.md',
					},
					{
						text: '8.15.11 Estrutura Geral de Rastreamento',
						link: '/09-optimization/15-tracing-the-optimizer/11-trace-general-structure.md',
					},
					{
						text: '8.15.12 Exemplo',
						link: '/09-optimization/15-tracing-the-optimizer/12-example.md',
					},
					{
						text: '8.15.13 Exibir rastros em outras aplicações',
						link: '/09-optimization/15-tracing-the-optimizer/13-displaying-traces-in-other-applications.md',
					},
					{
						text: '8.15.14 Prevenção do uso do Rastreador do Optimizer',
						link: '/09-optimization/15-tracing-the-optimizer/14-preventing-the-use-of-optimizer-trace.md',
					},
					{
						text: '8.15.15 Teste do Optimizer Trace',
						link: '/09-optimization/15-tracing-the-optimizer/15-testing-optimizer-trace.md',
					},
					{
						text: '8.15.16 Implementação do Rastreador de Otimizador',
						link: '/09-optimization/15-tracing-the-optimizer/16-optimizer-trace-implementation.md',
					},
				],
				link: '/09-optimization/15-tracing-the-optimizer/index.md',
			},
		],
		link: '/09-optimization/index.md',
	},
	{
		text: 'Capítulo 9 Estrutura da Língua',
		collapsed: true,
		items: [
			{
				text: '9.3 Palavras-chave e Palavras Reservadas',
				link: '/10-language-structure/03-keywords-and-reserved-words.md',
			},
			{
				text: '9.4 Variáveis Definidas pelo Usuário',
				link: '/10-language-structure/04-user-defined-variables.md',
			},
			{
				text: '9.5 Expressões',
				link: '/10-language-structure/05-expressions.md',
			},
			{
				text: '9.6 Comentários',
				link: '/10-language-structure/06-comments.md',
			},
			{
				text: '9.1 Valores Lógicos Básicos',
				collapsed: true,
				items: [
					{
						text: '9.1.1 Literais de String',
						link: '/10-language-structure/01-literal-values/01-string-literals.md',
					},
					{
						text: '9.1.2 Números literais',
						link: '/10-language-structure/01-literal-values/02-numeric-literals.md',
					},
					{
						text: '9.1.3 Datas e Horários Literais',
						link: '/10-language-structure/01-literal-values/03-date-and-time-literals.md',
					},
					{
						text: '9.1.4 Literais hexadecimais',
						link: '/10-language-structure/01-literal-values/04-hexadecimal-literals.md',
					},
					{
						text: '9.1.5 Literais de Valor de Bit',
						link: '/10-language-structure/01-literal-values/05-bit-value-literals.md',
					},
					{
						text: '9.1.6 Literais Booleanos',
						link: '/10-language-structure/01-literal-values/06-boolean-literals.md',
					},
					{
						text: '9.1.7 Valores nulos',
						link: '/10-language-structure/01-literal-values/07-n-u-l-l-values.md',
					},
				],
				link: '/10-language-structure/01-literal-values/index.md',
			},
			{
				text: '9.2 Nomes de Objetos de Esquema',
				collapsed: true,
				items: [
					{
						text: '9.2.1 Limites de comprimento do identificador',
						link: '/10-language-structure/02-schema-object-names/01-identifier-length-limits.md',
					},
					{
						text: '9.2.2 Identificadores qualificadores',
						link: '/10-language-structure/02-schema-object-names/02-identifier-qualifiers.md',
					},
					{
						text: '9.2.3 Sensibilidade do identificador à maiúscula e minúscula',
						link: '/10-language-structure/02-schema-object-names/03-identifier-case-sensitivity.md',
					},
					{
						text: '9.2.4 Mapeamento de Identificadores para Nomes de Arquivos',
						link: '/10-language-structure/02-schema-object-names/04-mapping-of-identifiers-to-file-names.md',
					},
					{
						text: '9.2.5 Análise e resolução do nome da função',
						link: '/10-language-structure/02-schema-object-names/05-function-name-parsing-and-resolution.md',
					},
				],
				link: '/10-language-structure/02-schema-object-names/index.md',
			},
		],
		link: '/10-language-structure/index.md',
	},
	{
		text: 'Capítulo 10 Conjuntos de caracteres, collation, Unicode',
		collapsed: true,
		items: [
			{
				text: '10.1 Conjuntos de caracteres e collation em geral',
				link: '/11-character-sets-collations-unicode/01-character-sets-and-collations-in-general.md',
			},
			{
				text: '10.4 Conjuntos de caracteres de conexão e codificações',
				link: '/11-character-sets-collations-unicode/04-connection-character-sets-and-collations.md',
			},
			{
				text: '10.5 Configurando o conjunto de caracteres e a codificação de aplicativos',
				link: '/11-character-sets-collations-unicode/05-configuring-application-character-set-and-collation.md',
			},
			{
				text: '10.6 Conjunto de caracteres de mensagem de erro',
				link: '/11-character-sets-collations-unicode/06-error-message-character-set.md',
			},
			{
				text: '10.7 Conversão do Conjunto de Caracteres da Coluna',
				link: '/11-character-sets-collations-unicode/07-column-character-set-conversion.md',
			},
			{
				text: '10.11 Restrições aos Conjuntos de Caracteres',
				link: '/11-character-sets-collations-unicode/11-restrictions-on-character-sets.md',
			},
			{
				text: '10.12 Definindo o idioma da mensagem de erro',
				link: '/11-character-sets-collations-unicode/12-setting-the-error-message-language.md',
			},
			{
				text: '10.15 Configuração do Conjunto de Caracteres',
				link: '/11-character-sets-collations-unicode/15-character-set-configuration.md',
			},
			{
				text: '10.16 Suporte ao Local do MySQL Server',
				link: '/11-character-sets-collations-unicode/16-my-s-q-l-server-locale-support.md',
			},
			{
				text: '10.2 Conjuntos de caracteres e collation no MySQL',
				collapsed: true,
				items: [
					{
						text: '10.2.1 Repertório de Caracteres',
						link: '/11-character-sets-collations-unicode/02-character-sets-and-collations-in-my-sql/01-character-set-repertoire.md',
					},
					{
						text: '10.2.2 UTF-8 para metadados',
						link: '/11-character-sets-collations-unicode/02-character-sets-and-collations-in-my-sql/02-utf-8-for-metadata.md',
					},
				],
				link: '/11-character-sets-collations-unicode/02-character-sets-and-collations-in-my-sql/index.md',
			},
			{
				text: '10.3 Especificação de Conjuntos de Caracteres e Colagens',
				collapsed: true,
				items: [
					{
						text: '10.3.1 Convenções de Nomenclatura de Colisões',
						link: '/11-character-sets-collations-unicode/03-specifying-character-sets-and-collations/01-collation-naming-conventions.md',
					},
					{
						text: '10.3.2 Conjunto de caracteres e codificação do servidor',
						link: '/11-character-sets-collations-unicode/03-specifying-character-sets-and-collations/02-server-character-set-and-collation.md',
					},
					{
						text: '10.3.3 Conjunto de caracteres e classificação de banco de dados',
						link: '/11-character-sets-collations-unicode/03-specifying-character-sets-and-collations/03-database-character-set-and-collation.md',
					},
					{
						text: '10.3.4 Conjunto de caracteres da tabela e classificação',
						link: '/11-character-sets-collations-unicode/03-specifying-character-sets-and-collations/04-table-character-set-and-collation.md',
					},
					{
						text: '10.3.5 Conjunto de caracteres da coluna e classificação',
						link: '/11-character-sets-collations-unicode/03-specifying-character-sets-and-collations/05-column-character-set-and-collation.md',
					},
					{
						text: '10.3.6 Conjunto de caracteres literais de strings de caracteres e comparação',
						link: '/11-character-sets-collations-unicode/03-specifying-character-sets-and-collations/06-character-string-literal-character-set-and-collation.md',
					},
					{
						text: '10.3.7 O Conjunto Nacional de Caracteres',
						link: '/11-character-sets-collations-unicode/03-specifying-character-sets-and-collations/07-the-national-character-set.md',
					},
					{
						text: '10.3.8 Introdutores de Conjunto de Caracteres',
						link: '/11-character-sets-collations-unicode/03-specifying-character-sets-and-collations/08-character-set-introducers.md',
					},
					{
						text: '10.3.9 Exemplos de Conjunto de Caracteres e Atribuição de Codificação',
						link: '/11-character-sets-collations-unicode/03-specifying-character-sets-and-collations/09-examples-of-character-set-and-collation-assignment.md',
					},
					{
						text: '10.3.10 Compatibilidade com outros SGBDs',
						link: '/11-character-sets-collations-unicode/03-specifying-character-sets-and-collations/10-compatibility-with-other-dbm-ss.md',
					},
				],
				link: '/11-character-sets-collations-unicode/03-specifying-character-sets-and-collations/index.md',
			},
			{
				text: '10.8 Problemas de Colaboração',
				collapsed: true,
				items: [
					{
						text: '10.8.1 Uso de COLLATE em instruções SQL',
						link: '/11-character-sets-collations-unicode/08-collation-issues/01-using-c-o-l-l-a-t-e-in-s-q-l-statements.md',
					},
					{
						text: '10.8.2 Cláusula de Precedência da cláusula COLLATE',
						link: '/11-character-sets-collations-unicode/08-collation-issues/02-c-o-l-l-a-t-e-clause-precedence.md',
					},
					{
						text: '10.8.3 Conjunto de caracteres e compatibilidade de cotação',
						link: '/11-character-sets-collations-unicode/08-collation-issues/03-character-set-and-collation-compatibility.md',
					},
					{
						text: '10.8.4 Coerção na Cotação de Expressões',
						link: '/11-character-sets-collations-unicode/08-collation-issues/04-collation-coercibility-in-expressions.md',
					},
					{
						text: '10.8.5 A Colagem Binária Comparada às Colagens _bin',
						link: '/11-character-sets-collations-unicode/08-collation-issues/05-the-binary-collation-compared-to-bin-collations.md',
					},
					{
						text: '10.8.6 Exemplos do efeito da cotação',
						link: '/11-character-sets-collations-unicode/08-collation-issues/06-examples-of-the-effect-of-collation.md',
					},
					{
						text: '10.8.7 Uso da Colagem em Pesquisas no INFORMATION_SCHEMA',
						link: '/11-character-sets-collations-unicode/08-collation-issues/07-using-collation-in-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-searches.md',
					},
				],
				link: '/11-character-sets-collations-unicode/08-collation-issues/index.md',
			},
			{
				text: '10.9 Suporte a Unicode',
				collapsed: true,
				items: [
					{
						text: '10.9.1 Conjunto de Caracteres utf8mb4 (Codificação Unicode UTF-8 de 4 bytes)',
						link: '/11-character-sets-collations-unicode/09-unicode-support/01-the-utf8-mb4-character-set-4-byte-utf-8-unicode-encoding.md',
					},
					{
						text: '10.9.2 O conjunto de caracteres utf8mb3 (codificação Unicode UTF-8 de 3 bytes)',
						link: '/11-character-sets-collations-unicode/09-unicode-support/02-the-utf8-mb3-character-set-3-byte-utf-8-unicode-encoding.md',
					},
					{
						text: '10.9.3 O conjunto de caracteres utf8 (alias para utf8mb3)',
						link: '/11-character-sets-collations-unicode/09-unicode-support/03-the-utf8-character-set-alias-for-utf8-mb3.md',
					},
					{
						text: '10.9.4 O Conjunto de Caracteres ucs2 (Codificação Unicode UCS-2)',
						link: '/11-character-sets-collations-unicode/09-unicode-support/04-the-ucs2-character-set-ucs-2-unicode-encoding.md',
					},
					{
						text: '10.9.5 O conjunto de caracteres utf16 (codificação Unicode UTF-16)',
						link: '/11-character-sets-collations-unicode/09-unicode-support/05-the-utf16-character-set-utf-16-unicode-encoding.md',
					},
					{
						text: '10.9.6 O conjunto de caracteres utf16le (codificação Unicode UTF-16LE)',
						link: '/11-character-sets-collations-unicode/09-unicode-support/06-the-utf16-le-character-set-utf-16-l-e-unicode-encoding.md',
					},
					{
						text: '10.9.7 O conjunto de caracteres utf32 (codificação Unicode UTF-32)',
						link: '/11-character-sets-collations-unicode/09-unicode-support/07-the-utf32-character-set-utf-32-unicode-encoding.md',
					},
					{
						text: '10.9.8 Conversão entre conjuntos de caracteres Unicode de 3 e 4 bytes',
						link: '/11-character-sets-collations-unicode/09-unicode-support/08-converting-between-3-byte-and-4-byte-unicode-character-sets.md',
					},
				],
				link: '/11-character-sets-collations-unicode/09-unicode-support/index.md',
			},
			{
				text: '10.10 Conjuntos de caracteres e codificações suportados',
				collapsed: true,
				items: [
					{
						text: '10.10.1 Conjuntos de Caracteres Unicode',
						link: '/11-character-sets-collations-unicode/10-supported-character-sets-and-collations/01-unicode-character-sets.md',
					},
					{
						text: '10.10.1 Conjuntos de Caracteres do Ocidente Europeu',
						link: '/11-character-sets-collations-unicode/10-supported-character-sets-and-collations/02-west-european-character-sets.md',
					},
					{
						text: '10.10.3 Caracteres de conjuntos de caracteres da Europa Central',
						link: '/11-character-sets-collations-unicode/10-supported-character-sets-and-collations/03-central-european-character-sets.md',
					},
					{
						text: '10.10.4 Conjuntos de caracteres do sul da Europa e do Oriente Médio',
						link: '/11-character-sets-collations-unicode/10-supported-character-sets-and-collations/04-south-european-and-middle-east-character-sets.md',
					},
					{
						text: '10.10.5 Conjuntos de caracteres bálticos',
						link: '/11-character-sets-collations-unicode/10-supported-character-sets-and-collations/05-baltic-character-sets.md',
					},
					{
						text: '10.10.6 Conjuntos de caracteres cirílicos',
						link: '/11-character-sets-collations-unicode/10-supported-character-sets-and-collations/06-cyrillic-character-sets.md',
					},
					{
						text: '10.10.8 O Conjunto de Caracteres Binário',
						link: '/11-character-sets-collations-unicode/10-supported-character-sets-and-collations/08-the-binary-character-set.md',
					},
					{
						text: '10.10.7 Conjuntos de caracteres asiáticos',
						collapsed: true,
						items: [
							{
								text: '10.10.7.1 Conjunto de Caracteres cp932',
								link: '/11-character-sets-collations-unicode/10-supported-character-sets-and-collations/07-asian-character-sets/01-the-cp932-character-set.md',
							},
							{
								text: '10.10.7.2 Conjunto de Caracteres gb18030',
								link: '/11-character-sets-collations-unicode/10-supported-character-sets-and-collations/07-asian-character-sets/02-the-gb18030-character-set.md',
							},
						],
						link: '/11-character-sets-collations-unicode/10-supported-character-sets-and-collations/07-asian-character-sets/index.md',
					},
				],
				link: '/11-character-sets-collations-unicode/10-supported-character-sets-and-collations/index.md',
			},
			{
				text: '10.13 Adicionando um Conjunto de Caracteres',
				collapsed: true,
				items: [
					{
						text: '10.13.1 Matrizes de Definição de Caracteres',
						link: '/11-character-sets-collations-unicode/13-adding-a-character-set/01-character-definition-arrays.md',
					},
					{
						text: '10.13.2 Suporte para a Colagem de Cadeias de Caracteres para Conjuntos Complejos de Caracteres',
						link: '/11-character-sets-collations-unicode/13-adding-a-character-set/02-string-collating-support-for-complex-character-sets.md',
					},
					{
						text: '10.13.3 Suporte a Caracteres Multi-Bytes para Conjuntos de Caracteres Complexos',
						link: '/11-character-sets-collations-unicode/13-adding-a-character-set/03-multi-byte-character-support-for-complex-character-sets.md',
					},
				],
				link: '/11-character-sets-collations-unicode/13-adding-a-character-set/index.md',
			},
			{
				text: '10.14 Adicionando uma Codificação a um Conjunto de Caracteres',
				collapsed: true,
				items: [
					{
						text: '10.14.1 Tipos de implementação de cotação',
						link: '/11-character-sets-collations-unicode/14-adding-a-collation-to-a-character-set/01-collation-implementation-types.md',
					},
					{
						text: '10.14.2 Escolher um ID de collation',
						link: '/11-character-sets-collations-unicode/14-adding-a-collation-to-a-character-set/02-choosing-a-collation-id.md',
					},
					{
						text: '10.14.3 Adicionando uma Colagem Simples a um Conjunto de Caracteres de 8 Bits',
						link: '/11-character-sets-collations-unicode/14-adding-a-collation-to-a-character-set/03-adding-a-simple-collation-to-an-8-bit-character-set.md',
					},
					{
						text: '10.14.4 Adicionando uma Codificação UCA a um Conjunto de Caracteres Unicode',
						collapsed: true,
						items: [
							{
								text: '10.14.4.1 Definindo uma Colaboração UCA Usando Sintaxe LDML',
								link: '/11-character-sets-collations-unicode/14-adding-a-collation-to-a-character-set/04-adding-a-u-c-a-collation-to-a-unicode-character-set/01-defining-a-u-c-a-collation-using-l-d-m-l-syntax.md',
							},
							{
								text: '10.14.4.2 Sintaxe LDML suportada no MySQL',
								link: '/11-character-sets-collations-unicode/14-adding-a-collation-to-a-character-set/04-adding-a-u-c-a-collation-to-a-unicode-character-set/02-l-d-m-l-syntax-supported-in-my-sql.md',
							},
							{
								text: '10.14.4.3 Diagnósticos durante a análise do Index.xml',
								link: '/11-character-sets-collations-unicode/14-adding-a-collation-to-a-character-set/04-adding-a-u-c-a-collation-to-a-unicode-character-set/03-diagnostics-during-index-xml-parsing.md',
							},
						],
						link: '/11-character-sets-collations-unicode/14-adding-a-collation-to-a-character-set/04-adding-a-u-c-a-collation-to-a-unicode-character-set/index.md',
					},
				],
				link: '/11-character-sets-collations-unicode/14-adding-a-collation-to-a-character-set/index.md',
			},
		],
		link: '/11-character-sets-collations-unicode/index.md',
	},
	{
		text: 'Capítulo 11 Tipos de dados',
		collapsed: true,
		items: [
			{
				text: '11.5 Tipo de dados JSON',
				link: '/12-data-types/05-the-j-s-o-n-data-type.md',
			},
			{
				text: '11.6 Valores padrão do tipo de dados',
				link: '/12-data-types/06-data-type-default-values.md',
			},
			{
				text: '11.7 Requisitos de armazenamento de tipos de dados',
				link: '/12-data-types/07-data-type-storage-requirements.md',
			},
			{
				text: '11.8 Escolhendo o Tipo Certo para uma Coluna',
				link: '/12-data-types/08-choosing-the-right-type-for-a-column.md',
			},
			{
				text: '11.9 Usando Tipos de Dados de Outros Motores de Banco de Dados',
				link: '/12-data-types/09-using-data-types-from-other-database-engines.md',
			},
			{
				text: '11.1 Tipos de dados numéricos',
				collapsed: true,
				items: [
					{
						text: '11.1.1 Sintaxe do Tipo de Dados Numérico',
						link: '/12-data-types/01-numeric-data-types/01-numeric-data-type-syntax.md',
					},
					{
						text: '11.1.2 Tipos inteiros (valor exato) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT',
						link: '/12-data-types/01-numeric-data-types/02-integer-types-exact-value-integer-int-smallint-tinyint-mediumint-bigint.md',
					},
					{
						text: '11.1.3 Tipos de Ponto Fixo (Valor Exato) - DECIMAL, NUMERIC',
						link: '/12-data-types/01-numeric-data-types/03-fixed-point-types-exact-value-decimal-numeric.md',
					},
					{
						text: '11.1.4 Tipos de Ponto Flutuante (Valor Aproximado) - FLOAT, DOUBLE',
						link: '/12-data-types/01-numeric-data-types/04-floating-point-types-approximate-value-float-double.md',
					},
					{
						text: '11.1.5 Tipo de Valor de Bit - BIT',
						link: '/12-data-types/01-numeric-data-types/05-bit-value-type-bit.md',
					},
					{
						text: '11.1.6 Atributos de Tipo Numérico',
						link: '/12-data-types/01-numeric-data-types/06-numeric-type-attributes.md',
					},
					{
						text: '11.1.7 Gerenciamento de Saída Fora do Alcance e Transbordamento',
						link: '/12-data-types/01-numeric-data-types/07-out-of-range-and-overflow-handling.md',
					},
				],
				link: '/12-data-types/01-numeric-data-types/index.md',
			},
			{
				text: '11.2 Tipos de dados de data e hora',
				collapsed: true,
				items: [
					{
						text: '11.2.1 Tipo de dados de data e hora Sintaxe',
						link: '/12-data-types/02-date-and-time-data-types/01-date-and-time-data-type-syntax.md',
					},
					{
						text: '11.2.2 Tipos DATE, DATETIME e TIMESTAMP',
						link: '/12-data-types/02-date-and-time-data-types/02-the-date-datetime-and-t-i-m-e-s-t-a-m-p-types.md',
					},
					{
						text: '11.2.3 O Tipo TIME',
						link: '/12-data-types/02-date-and-time-data-types/03-the-t-i-m-e-type.md',
					},
					{
						text: '11.2.4 O Tipo ANO',
						link: '/12-data-types/02-date-and-time-data-types/04-the-y-e-a-r-type.md',
					},
					{
						text: '11.2.5 Limitações do ANO(2) de 2 dígitos e migração para o ANO de 4 dígitos',
						link: '/12-data-types/02-date-and-time-data-types/05-2-digit-year-2-limitations-and-migrating-to-4-digit-year.md',
					},
					{
						text: '11.2.6 Inicialização e atualização automáticas para TIMESTAMP e DATETIME',
						link: '/12-data-types/02-date-and-time-data-types/06-automatic-initialization-and-updating-for-t-i-m-e-s-t-a-m-p-and-datetime.md',
					},
					{
						text: '11.2.7 Segundos fracionários em valores de tempo',
						link: '/12-data-types/02-date-and-time-data-types/07-fractional-seconds-in-time-values.md',
					},
					{
						text: '11.2.8 Qual calendário é usado pelo MySQL?',
						link: '/12-data-types/02-date-and-time-data-types/08-what-calendar-is-used-by-my-sql.md',
					},
					{
						text: '11.2.9 Conversão entre tipos de data e hora',
						link: '/12-data-types/02-date-and-time-data-types/09-conversion-between-date-and-time-types.md',
					},
					{
						text: '11.2.10 Anos de 2 dígitos nas datas',
						link: '/12-data-types/02-date-and-time-data-types/10-2-digit-years-in-dates.md',
					},
				],
				link: '/12-data-types/02-date-and-time-data-types/index.md',
			},
			{
				text: '11.3 Tipos de dados de cadeia',
				collapsed: true,
				items: [
					{
						text: '11.3.1 Sintaxe do Tipo de Dados String',
						link: '/12-data-types/03-string-data-types/01-string-data-type-syntax.md',
					},
					{
						text: '11.3.2 Tipos CHAR e VARCHAR',
						link: '/12-data-types/03-string-data-types/02-the-c-h-a-r-and-v-a-r-c-h-a-r-types.md',
					},
					{
						text: '11.3.3 Os tipos BINARY e VARBINARY',
						link: '/12-data-types/03-string-data-types/03-the-b-i-n-a-r-y-and-v-a-r-b-i-n-a-r-y-types.md',
					},
					{
						text: '11.3.4 Os tipos BLOB e TEXTO',
						link: '/12-data-types/03-string-data-types/04-the-b-l-o-b-and-t-e-x-t-types.md',
					},
					{
						text: '11.3.5 O Tipo ENUM',
						link: '/12-data-types/03-string-data-types/05-the-e-n-u-m-type.md',
					},
					{
						text: '11.3.6 O Tipo SET',
						link: '/12-data-types/03-string-data-types/06-the-s-e-t-type.md',
					},
				],
				link: '/12-data-types/03-string-data-types/index.md',
			},
			{
				text: '11.4 Tipos de dados espaciais',
				collapsed: true,
				items: [
					{
						text: '11.4.1 Tipos de dados espaciais',
						link: '/12-data-types/04-spatial-data-types/01-spatial-data-types.md',
					},
					{
						text: '11.4.3 Formas de dados espaciais suportadas',
						link: '/12-data-types/04-spatial-data-types/03-supported-spatial-data-formats.md',
					},
					{
						text: '11.4.4 Geometria - Formação e Validade',
						link: '/12-data-types/04-spatial-data-types/04-geometry-well-formedness-and-validity.md',
					},
					{
						text: '11.4.5 Criando Colunas Espaciais',
						link: '/12-data-types/04-spatial-data-types/05-creating-spatial-columns.md',
					},
					{
						text: '11.4.6 Populando Colunas Espaciais',
						link: '/12-data-types/04-spatial-data-types/06-populating-spatial-columns.md',
					},
					{
						text: '11.4.7 Obter Dados Espaciais',
						link: '/12-data-types/04-spatial-data-types/07-fetching-spatial-data.md',
					},
					{
						text: '11.4.8 Otimização da Análise Espacial',
						link: '/12-data-types/04-spatial-data-types/08-optimizing-spatial-analysis.md',
					},
					{
						text: '11.4.9 Criando Índices Espaciais',
						link: '/12-data-types/04-spatial-data-types/09-creating-spatial-indexes.md',
					},
					{
						text: '11.4.10 Uso de índices espaciais',
						link: '/12-data-types/04-spatial-data-types/10-using-spatial-indexes.md',
					},
					{
						text: '11.4.2 O Modelo de Geometria OpenGIS',
						collapsed: true,
						items: [
							{
								text: '11.4.2.1 Hierarquia da Classe de Geometria',
								link: '/12-data-types/04-spatial-data-types/02-the-open-g-i-s-geometry-model/01-the-geometry-class-hierarchy.md',
							},
							{
								text: '11.4.2.2 Classe de Geometria',
								link: '/12-data-types/04-spatial-data-types/02-the-open-g-i-s-geometry-model/02-geometry-class.md',
							},
							{
								text: '11.4.2.3 Classe de Pontos',
								link: '/12-data-types/04-spatial-data-types/02-the-open-g-i-s-geometry-model/03-point-class.md',
							},
							{
								text: '11.4.2.4 Classe de curva',
								link: '/12-data-types/04-spatial-data-types/02-the-open-g-i-s-geometry-model/04-curve-class.md',
							},
							{
								text: '11.4.2.5 Classe LineString',
								link: '/12-data-types/04-spatial-data-types/02-the-open-g-i-s-geometry-model/05-line-string-class.md',
							},
							{
								text: '11.4.2.6 Classe de superfície',
								link: '/12-data-types/04-spatial-data-types/02-the-open-g-i-s-geometry-model/06-surface-class.md',
							},
							{
								text: '11.4.2.7 Classe Polygon',
								link: '/12-data-types/04-spatial-data-types/02-the-open-g-i-s-geometry-model/07-polygon-class.md',
							},
							{
								text: '11.4.2.8 Classe GeometryCollection',
								link: '/12-data-types/04-spatial-data-types/02-the-open-g-i-s-geometry-model/08-geometry-collection-class.md',
							},
							{
								text: '11.4.2.9 Classe MultiPoint',
								link: '/12-data-types/04-spatial-data-types/02-the-open-g-i-s-geometry-model/09-multi-point-class.md',
							},
							{
								text: '11.4.2.10 Classe MultiCurve',
								link: '/12-data-types/04-spatial-data-types/02-the-open-g-i-s-geometry-model/10-multi-curve-class.md',
							},
							{
								text: '11.4.2.11 Classe MultiLineString',
								link: '/12-data-types/04-spatial-data-types/02-the-open-g-i-s-geometry-model/11-multi-line-string-class.md',
							},
							{
								text: '11.4.2.12 Classe MultiSurface',
								link: '/12-data-types/04-spatial-data-types/02-the-open-g-i-s-geometry-model/12-multi-surface-class.md',
							},
							{
								text: '11.4.2.13 Classe MultiPolygon',
								link: '/12-data-types/04-spatial-data-types/02-the-open-g-i-s-geometry-model/13-multi-polygon-class.md',
							},
						],
						link: '/12-data-types/04-spatial-data-types/02-the-open-g-i-s-geometry-model/index.md',
					},
				],
				link: '/12-data-types/04-spatial-data-types/index.md',
			},
		],
		link: '/12-data-types/index.md',
	},
	{
		text: 'Capítulo 12 Funções e Operadores',
		collapsed: true,
		items: [
			{
				text: '12.1 Função integrada e referência ao operador',
				link: '/13-functions-and-operators/01-built-in-function-and-operator-reference.md',
			},
			{
				text: '12.2 Referência de Função Carregável',
				link: '/13-functions-and-operators/02-loadable-function-reference.md',
			},
			{
				text: '12.3 Conversão de Tipo na Avaliação de Expressões',
				link: '/13-functions-and-operators/03-type-conversion-in-expression-evaluation.md',
			},
			{
				text: '12.5 Funções de controle de fluxo',
				link: '/13-functions-and-operators/05-flow-control-functions.md',
			},
			{
				text: '12.7 Funções de data e hora',
				link: '/13-functions-and-operators/07-date-and-time-functions.md',
			},
			{
				text: '12.10 Funções e operadores de cast',
				link: '/13-functions-and-operators/10-cast-functions-and-operators.md',
			},
			{
				text: '12.11 Funções XML',
				link: '/13-functions-and-operators/11-x-m-l-functions.md',
			},
			{
				text: '12.12 Funções e operadores de bits',
				link: '/13-functions-and-operators/12-bit-functions-and-operators.md',
			},
			{
				text: '12.13 Funções de Criptografia e Compressão',
				link: '/13-functions-and-operators/13-encryption-and-compression-functions.md',
			},
			{
				text: '12.14 Funções de bloqueio',
				link: '/13-functions-and-operators/14-locking-functions.md',
			},
			{
				text: '12.15 Funções de Informação',
				link: '/13-functions-and-operators/15-information-functions.md',
			},
			{
				text: '12.18 Funções utilizadas com identificadores de transação global (GTIDs)',
				link: '/13-functions-and-operators/18-functions-used-with-global-transaction-identifiers-gti-ds.md',
			},
			{
				text: '12.20 Funções Diversas',
				link: '/13-functions-and-operators/20-miscellaneous-functions.md',
			},
			{
				text: '12.4 Operadores',
				collapsed: true,
				items: [
					{
						text: '12.4.1 Prioridade do Operador',
						link: '/13-functions-and-operators/04-operators/01-operator-precedence.md',
					},
					{
						text: '12.4.2 Funções e operadores de comparação',
						link: '/13-functions-and-operators/04-operators/02-comparison-functions-and-operators.md',
					},
					{
						text: '12.4.3 Operadores Lógicos',
						link: '/13-functions-and-operators/04-operators/03-logical-operators.md',
					},
					{
						text: '12.4.4 Operadores de atribuição',
						link: '/13-functions-and-operators/04-operators/04-assignment-operators.md',
					},
				],
				link: '/13-functions-and-operators/04-operators/index.md',
			},
			{
				text: '12.6 Funções e operadores numéricos',
				collapsed: true,
				items: [
					{
						text: '12.6.1 Operadores aritméticos',
						link: '/13-functions-and-operators/06-numeric-functions-and-operators/01-arithmetic-operators.md',
					},
					{
						text: '12.6.2 Funções matemáticas',
						link: '/13-functions-and-operators/06-numeric-functions-and-operators/02-mathematical-functions.md',
					},
				],
				link: '/13-functions-and-operators/06-numeric-functions-and-operators/index.md',
			},
			{
				text: '12.8 Funções e operadores de strings',
				collapsed: true,
				items: [
					{
						text: '12.8.1 Funções e operadores de comparação de strings',
						link: '/13-functions-and-operators/08-string-functions-and-operators/01-string-comparison-functions-and-operators.md',
					},
					{
						text: '12.8.2 Expressões Regulares',
						link: '/13-functions-and-operators/08-string-functions-and-operators/02-regular-expressions.md',
					},
					{
						text: '12.8.3 Conjunto de caracteres e comparação dos resultados das funções',
						link: '/13-functions-and-operators/08-string-functions-and-operators/03-character-set-and-collation-of-function-results.md',
					},
				],
				link: '/13-functions-and-operators/08-string-functions-and-operators/index.md',
			},
			{
				text: '12.9 Funções de pesquisa de texto completo',
				collapsed: true,
				items: [
					{
						text: '12.9.1 Pesquisas de Texto Completo em Linguagem Natural',
						link: '/13-functions-and-operators/09-full-text-search-functions/01-natural-language-full-text-searches.md',
					},
					{
						text: '12.9.2 Pesquisas de Texto Completas Booleanas',
						link: '/13-functions-and-operators/09-full-text-search-functions/02-boolean-full-text-searches.md',
					},
					{
						text: '12.9.3 Pesquisas de texto completo com expansão de consulta',
						link: '/13-functions-and-operators/09-full-text-search-functions/03-full-text-searches-with-query-expansion.md',
					},
					{
						text: '12.9.4 Palavras-chave completas de stopwords',
						link: '/13-functions-and-operators/09-full-text-search-functions/04-full-text-stopwords.md',
					},
					{
						text: '12.9.5 Restrições de texto completo',
						link: '/13-functions-and-operators/09-full-text-search-functions/05-full-text-restrictions.md',
					},
					{
						text: '12.9.6 Ajuste fino da pesquisa de texto completo do MySQL',
						link: '/13-functions-and-operators/09-full-text-search-functions/06-fine-tuning-my-s-q-l-full-text-search.md',
					},
					{
						text: '12.9.7 Adicionando uma Cotação Definida pelo Usuário para Indexação de Texto Completo',
						link: '/13-functions-and-operators/09-full-text-search-functions/07-adding-a-user-defined-collation-for-full-text-indexing.md',
					},
					{
						text: '12.9.8 Parser de Texto Completo ngram',
						link: '/13-functions-and-operators/09-full-text-search-functions/08-ngram-full-text-parser.md',
					},
					{
						text: '12.9.9 Plugin do Analizador de Texto Completo MeCab',
						link: '/13-functions-and-operators/09-full-text-search-functions/09-me-cab-full-text-parser-plugin.md',
					},
				],
				link: '/13-functions-and-operators/09-full-text-search-functions/index.md',
			},
			{
				text: '12.16 Funções de Análise Espacial',
				collapsed: true,
				items: [
					{
						text: '12.16.1 Referência de Função Espacial',
						link: '/13-functions-and-operators/16-spatial-analysis-functions/01-spatial-function-reference.md',
					},
					{
						text: '12.16.2 Tratamento de argumentos por funções espaciais',
						link: '/13-functions-and-operators/16-spatial-analysis-functions/02-argument-handling-by-spatial-functions.md',
					},
					{
						text: '12.16.3 Funções que criam valores de geometria a partir de valores WKT',
						link: '/13-functions-and-operators/16-spatial-analysis-functions/03-functions-that-create-geometry-values-from-w-k-t-values.md',
					},
					{
						text: '12.16.4 Funções que criam valores de geometria a partir de valores WKB',
						link: '/13-functions-and-operators/16-spatial-analysis-functions/04-functions-that-create-geometry-values-from-w-k-b-values.md',
					},
					{
						text: '12.16.5 Funções específicas do MySQL que criam valores de geometria',
						link: '/13-functions-and-operators/16-spatial-analysis-functions/05-my-sql-specific-functions-that-create-geometry-values.md',
					},
					{
						text: '12.16.6 Funções de conversão de formato de geometria',
						link: '/13-functions-and-operators/16-spatial-analysis-functions/06-geometry-format-conversion-functions.md',
					},
					{
						text: '12.16.8 Funções de Operadores Espaciais',
						link: '/13-functions-and-operators/16-spatial-analysis-functions/08-spatial-operator-functions.md',
					},
					{
						text: '12.16.10 Funções de Geohash Espaciais',
						link: '/13-functions-and-operators/16-spatial-analysis-functions/10-spatial-geohash-functions.md',
					},
					{
						text: '12.16.11 Funções GeoJSON Espacial',
						link: '/13-functions-and-operators/16-spatial-analysis-functions/11-spatial-geo-j-s-o-n-functions.md',
					},
					{
						text: '12.16.12 Funções de conveniência espacial',
						link: '/13-functions-and-operators/16-spatial-analysis-functions/12-spatial-convenience-functions.md',
					},
					{
						text: '12.16.7 Funções de Propriedade de Geometria',
						collapsed: true,
						items: [
							{
								text: '12.16.7.1 Funções de Propriedade Geométrica Geral',
								link: '/13-functions-and-operators/16-spatial-analysis-functions/07-geometry-property-functions/01-general-geometry-property-functions.md',
							},
							{
								text: '12.16.7.2 Funções de Propriedade de Pontos',
								link: '/13-functions-and-operators/16-spatial-analysis-functions/07-geometry-property-functions/02-point-property-functions.md',
							},
							{
								text: '12.16.7.3 Funções de Propriedade de LineString e MultiLineString',
								link: '/13-functions-and-operators/16-spatial-analysis-functions/07-geometry-property-functions/03-line-string-and-multi-line-string-property-functions.md',
							},
							{
								text: '12.16.7.4 Funções de Propriedade de Poligono e MultiPoligono',
								link: '/13-functions-and-operators/16-spatial-analysis-functions/07-geometry-property-functions/04-polygon-and-multi-polygon-property-functions.md',
							},
							{
								text: '12.16.7.5 Funções de Propriedade de GeometryCollection',
								link: '/13-functions-and-operators/16-spatial-analysis-functions/07-geometry-property-functions/05-geometry-collection-property-functions.md',
							},
						],
						link: '/13-functions-and-operators/16-spatial-analysis-functions/07-geometry-property-functions/index.md',
					},
					{
						text: '12.16.9 Funções que testam as relações espaciais entre objetos geométricos',
						collapsed: true,
						items: [
							{
								text: '12.16.9.1 Funções de Relação Espacial que Utilizam Formas de Objetos',
								link: '/13-functions-and-operators/16-spatial-analysis-functions/09-functions-that-test-spatial-relations-between-geometry-objects/01-spatial-relation-functions-that-use-object-shapes.md',
							},
							{
								text: '12.16.9.2 Funções de Relação Espacial que Utilizam Rectângulos de Limite Mínimos',
								link: '/13-functions-and-operators/16-spatial-analysis-functions/09-functions-that-test-spatial-relations-between-geometry-objects/02-spatial-relation-functions-that-use-minimum-bounding-rectangles.md',
							},
						],
						link: '/13-functions-and-operators/16-spatial-analysis-functions/09-functions-that-test-spatial-relations-between-geometry-objects/index.md',
					},
				],
				link: '/13-functions-and-operators/16-spatial-analysis-functions/index.md',
			},
			{
				text: '12.17 Funções JSON',
				collapsed: true,
				items: [
					{
						text: '12.17.1 Referência de Função JSON',
						link: '/13-functions-and-operators/17-j-s-o-n-functions/01-j-s-o-n-function-reference.md',
					},
					{
						text: '12.17.2 Funções que criam valores JSON',
						link: '/13-functions-and-operators/17-j-s-o-n-functions/02-functions-that-create-j-s-o-n-values.md',
					},
					{
						text: '12.17.3 Funções que buscam valores JSON',
						link: '/13-functions-and-operators/17-j-s-o-n-functions/03-functions-that-search-j-s-o-n-values.md',
					},
					{
						text: '12.17.4 Funções que modificam valores JSON',
						link: '/13-functions-and-operators/17-j-s-o-n-functions/04-functions-that-modify-j-s-o-n-values.md',
					},
					{
						text: '12.17.5 Funções que retornam atributos de valor JSON',
						link: '/13-functions-and-operators/17-j-s-o-n-functions/05-functions-that-return-j-s-o-n-value-attributes.md',
					},
					{
						text: '12.17.6 Funções de Utilitário JSON',
						link: '/13-functions-and-operators/17-j-s-o-n-functions/06-j-s-o-n-utility-functions.md',
					},
				],
				link: '/13-functions-and-operators/17-j-s-o-n-functions/index.md',
			},
			{
				text: '12.19 Funções agregadas',
				collapsed: true,
				items: [
					{
						text: '12.19.1 Descrições de Funções Agregadas',
						link: '/13-functions-and-operators/19-aggregate-functions/01-aggregate-function-descriptions.md',
					},
					{
						text: '12.19.2 GROUP BY Modificadores',
						link: '/13-functions-and-operators/19-aggregate-functions/02-g-r-o-u-p-b-y-modifiers.md',
					},
					{
						text: '12.19.3 MySQL: Gerenciamento do GROUP BY',
						link: '/13-functions-and-operators/19-aggregate-functions/03-my-s-q-l-handling-of-g-r-o-u-p-by.md',
					},
					{
						text: '12.19.4 Detecção de Dependência Funcional',
						link: '/13-functions-and-operators/19-aggregate-functions/04-detection-of-functional-dependence.md',
					},
				],
				link: '/13-functions-and-operators/19-aggregate-functions/index.md',
			},
			{
				text: '12.21 Matemática de Precisão',
				collapsed: true,
				items: [
					{
						text: '12.21.1 Tipos de valores numéricos',
						link: '/13-functions-and-operators/21-precision-math/01-types-of-numeric-values.md',
					},
					{
						text: '12.21.2 Características do Tipo de Dados DECIMAL',
						link: '/13-functions-and-operators/21-precision-math/02-d-e-c-i-m-a-l-data-type-characteristics.md',
					},
					{
						text: '12.21.3 Tratamento de Expressões',
						link: '/13-functions-and-operators/21-precision-math/03-expression-handling.md',
					},
					{
						text: '12.21.4 Comportamento de arredondamento',
						link: '/13-functions-and-operators/21-precision-math/04-rounding-behavior.md',
					},
					{
						text: '12.21.5 Exemplos de matemática de precisão',
						link: '/13-functions-and-operators/21-precision-math/05-precision-math-examples.md',
					},
				],
				link: '/13-functions-and-operators/21-precision-math/index.md',
			},
		],
		link: '/13-functions-and-operators/index.md',
	},
	{
		text: 'Capítulo 13: Declarações SQL',
		collapsed: true,
		items: [
			{
				text: '13.1 Declarações de Definição de Dados',
				collapsed: true,
				items: [
					{
						text: '13.1.1 Declaração ALTER DATABASE',
						link: '/14-sql-statements/01-data-definition-statements/01-a-l-t-e-r-d-a-t-a-b-a-s-e-statement.md',
					},
					{
						text: '13.1.2 Declaração de ALTER EVENT',
						link: '/14-sql-statements/01-data-definition-statements/02-a-l-t-e-r-e-v-e-n-t-statement.md',
					},
					{
						text: '13.1.3 Declaração ALTER FUNCTION',
						link: '/14-sql-statements/01-data-definition-statements/03-a-l-t-e-r-f-u-n-c-t-i-o-n-statement.md',
					},
					{
						text: '13.1.4 Declaração ALTER INSTANCE',
						link: '/14-sql-statements/01-data-definition-statements/04-a-l-t-e-r-i-n-s-t-a-n-c-e-statement.md',
					},
					{
						text: '13.1.5 Declaração ALTER LOGFILE GROUP',
						link: '/14-sql-statements/01-data-definition-statements/05-a-l-t-e-r-l-o-g-f-i-l-e-g-r-o-u-p-statement.md',
					},
					{
						text: '13.1.6 Declaração ALTER PROCEDURE',
						link: '/14-sql-statements/01-data-definition-statements/06-a-l-t-e-r-p-r-o-c-e-d-u-r-e-statement.md',
					},
					{
						text: '13.1.7 Declaração ALTER SERVER',
						link: '/14-sql-statements/01-data-definition-statements/07-a-l-t-e-r-s-e-r-v-e-r-statement.md',
					},
					{
						text: '13.1.9 Declaração ALTER TABLESPACE',
						link: '/14-sql-statements/01-data-definition-statements/09-a-l-t-e-r-t-a-b-l-e-s-p-a-c-e-statement.md',
					},
					{
						text: '13.1.10 Declaração ALTER VIEW',
						link: '/14-sql-statements/01-data-definition-statements/10-a-l-t-e-r-v-i-e-w-statement.md',
					},
					{
						text: '13.1.11 Declaração CREATE DATABASE',
						link: '/14-sql-statements/01-data-definition-statements/11-c-r-e-a-t-e-d-a-t-a-b-a-s-e-statement.md',
					},
					{
						text: '13.1.12 Declaração de Criação de Evento',
						link: '/14-sql-statements/01-data-definition-statements/12-c-r-e-a-t-e-e-v-e-n-t-statement.md',
					},
					{
						text: '13.1.13 Declaração CREATE FUNCTION',
						link: '/14-sql-statements/01-data-definition-statements/13-c-r-e-a-t-e-f-u-n-c-t-i-o-n-statement.md',
					},
					{
						text: '13.1.14 Declaração CREATE INDEX',
						link: '/14-sql-statements/01-data-definition-statements/14-c-r-e-a-t-e-i-n-d-e-x-statement.md',
					},
					{
						text: '13.1.15 Declaração CREATE LOGFILE GROUP',
						link: '/14-sql-statements/01-data-definition-statements/15-c-r-e-a-t-e-l-o-g-f-i-l-e-g-r-o-u-p-statement.md',
					},
					{
						text: '13.1.16 Declarações CREATE PROCEDURE e CREATE FUNCTION',
						link: '/14-sql-statements/01-data-definition-statements/16-c-r-e-a-t-e-p-r-o-c-e-d-u-r-e-and-c-r-e-a-t-e-f-u-n-c-t-i-o-n-statements.md',
					},
					{
						text: '13.1.17 Declaração CREATE SERVER',
						link: '/14-sql-statements/01-data-definition-statements/17-c-r-e-a-t-e-s-e-r-v-e-r-statement.md',
					},
					{
						text: '13.1.19 Declaração CREATE TABLESPACE',
						link: '/14-sql-statements/01-data-definition-statements/19-c-r-e-a-t-e-t-a-b-l-e-s-p-a-c-e-statement.md',
					},
					{
						text: '13.1.20 Declaração CREATE TRIGGER',
						link: '/14-sql-statements/01-data-definition-statements/20-c-r-e-a-t-e-t-r-i-g-g-e-r-statement.md',
					},
					{
						text: '13.1.21 Declaração CREATE VIEW',
						link: '/14-sql-statements/01-data-definition-statements/21-c-r-e-a-t-e-v-i-e-w-statement.md',
					},
					{
						text: '13.1.22 Declaração DROP DATABASE',
						link: '/14-sql-statements/01-data-definition-statements/22-d-r-o-p-d-a-t-a-b-a-s-e-statement.md',
					},
					{
						text: '13.1.23 Declaração de Evento de Queda',
						link: '/14-sql-statements/01-data-definition-statements/23-d-r-o-p-e-v-e-n-t-statement.md',
					},
					{
						text: '13.1.24 Declaração da função DROP',
						link: '/14-sql-statements/01-data-definition-statements/24-d-r-o-p-f-u-n-c-t-i-o-n-statement.md',
					},
					{
						text: '13.1.25 Declaração DROP INDEX',
						link: '/14-sql-statements/01-data-definition-statements/25-d-r-o-p-i-n-d-e-x-statement.md',
					},
					{
						text: '13.1.26 Declaração DROP LOGFILE GROUP',
						link: '/14-sql-statements/01-data-definition-statements/26-d-r-o-p-l-o-g-f-i-l-e-g-r-o-u-p-statement.md',
					},
					{
						text: '13.1.27 Declarações de procedimentos de exclusão e funções de exclusão',
						link: '/14-sql-statements/01-data-definition-statements/27-d-r-o-p-p-r-o-c-e-d-u-r-e-and-d-r-o-p-f-u-n-c-t-i-o-n-statements.md',
					},
					{
						text: '13.1.28 Declaração DROP SERVER',
						link: '/14-sql-statements/01-data-definition-statements/28-d-r-o-p-s-e-r-v-e-r-statement.md',
					},
					{
						text: '13.1.29 Declaração DROP TABLE',
						link: '/14-sql-statements/01-data-definition-statements/29-d-r-o-p-t-a-b-l-e-statement.md',
					},
					{
						text: '13.1.30 Declaração DROP TABLESPACE',
						link: '/14-sql-statements/01-data-definition-statements/30-d-r-o-p-t-a-b-l-e-s-p-a-c-e-statement.md',
					},
					{
						text: '13.1.31 Declaração DROP TRIGGER',
						link: '/14-sql-statements/01-data-definition-statements/31-d-r-o-p-t-r-i-g-g-e-r-statement.md',
					},
					{
						text: '13.1.32 Declaração DROP VIEW',
						link: '/14-sql-statements/01-data-definition-statements/32-d-r-o-p-v-i-e-w-statement.md',
					},
					{
						text: '13.1.33 Declaração de RENOMEAR Tabela',
						link: '/14-sql-statements/01-data-definition-statements/33-r-e-n-a-m-e-t-a-b-l-e-statement.md',
					},
					{
						text: '13.1.34 Declaração `TRUNCATE TABLE`',
						link: '/14-sql-statements/01-data-definition-statements/34-t-r-u-n-c-a-t-e-t-a-b-l-e-statement.md',
					},
					{
						text: '13.1.8 Declaração ALTER TABLE',
						collapsed: true,
						items: [
							{
								text: '13.1.8.1 Operações de Partição em Tabelas ALTER',
								link: '/14-sql-statements/01-data-definition-statements/08-a-l-t-e-r-t-a-b-l-e-statement/01-a-l-t-e-r-t-a-b-l-e-partition-operations.md',
							},
							{
								text: '13.1.8.2 ALTER TABLE e Colunas Geradas',
								link: '/14-sql-statements/01-data-definition-statements/08-a-l-t-e-r-t-a-b-l-e-statement/02-a-l-t-e-r-t-a-b-l-e-and-generated-columns.md',
							},
							{
								text: '13.1.8.3 Exemplos de ALTER TABLE',
								link: '/14-sql-statements/01-data-definition-statements/08-a-l-t-e-r-t-a-b-l-e-statement/03-a-l-t-e-r-t-a-b-l-e-examples.md',
							},
						],
						link: '/14-sql-statements/01-data-definition-statements/08-a-l-t-e-r-t-a-b-l-e-statement/index.md',
					},
					{
						text: '13.1.18 Declaração CREATE TABLE',
						collapsed: true,
						items: [
							{
								text: '13.1.18.1 Arquivos criados por CREATE TABLE',
								link: '/14-sql-statements/01-data-definition-statements/18-c-r-e-a-t-e-t-a-b-l-e-statement/01-files-created-by-c-r-e-a-t-e-table.md',
							},
							{
								text: '13.1.18.2 Declaração de Criação de Tabela Temporária',
								link: '/14-sql-statements/01-data-definition-statements/18-c-r-e-a-t-e-t-a-b-l-e-statement/02-c-r-e-a-t-e-t-e-m-p-o-r-a-r-y-t-a-b-l-e-statement.md',
							},
							{
								text: '13.1.18.3 Declaração `CREATE TABLE ... LIKE`',
								link: '/14-sql-statements/01-data-definition-statements/18-c-r-e-a-t-e-t-a-b-l-e-statement/03-c-r-e-a-t-e-t-a-b-l-e-l-i-k-e-statement.md',
							},
							{
								text: '13.1.18.4 Criar uma tabela com uma instrução SELECT',
								link: '/14-sql-statements/01-data-definition-statements/18-c-r-e-a-t-e-t-a-b-l-e-statement/04-c-r-e-a-t-e-t-a-b-l-e-s-e-l-e-c-t-statement.md',
							},
							{
								text: '13.1.18.5 Restrições de Chave Estrangeira',
								link: '/14-sql-statements/01-data-definition-statements/18-c-r-e-a-t-e-t-a-b-l-e-statement/05-f-o-r-e-i-g-n-k-e-y-constraints.md',
							},
							{
								text: '13.1.18.6 Alterações nas especificações da coluna silenciosa',
								link: '/14-sql-statements/01-data-definition-statements/18-c-r-e-a-t-e-t-a-b-l-e-statement/06-silent-column-specification-changes.md',
							},
							{
								text: '13.1.18.7 Criar uma tabela e colunas geradas',
								link: '/14-sql-statements/01-data-definition-statements/18-c-r-e-a-t-e-t-a-b-l-e-statement/07-c-r-e-a-t-e-t-a-b-l-e-and-generated-columns.md',
							},
							{
								text: '13.1.18.8 Índices Secundários e Colunas Geradas',
								link: '/14-sql-statements/01-data-definition-statements/18-c-r-e-a-t-e-t-a-b-l-e-statement/08-secondary-indexes-and-generated-columns.md',
							},
							{
								text: '13.1.18.9 Definindo as Opções de Comentário do NDB',
								link: '/14-sql-statements/01-data-definition-statements/18-c-r-e-a-t-e-t-a-b-l-e-statement/09-setting-n-d-b-comment-options.md',
							},
						],
						link: '/14-sql-statements/01-data-definition-statements/18-c-r-e-a-t-e-t-a-b-l-e-statement/index.md',
					},
				],
				link: '/14-sql-statements/01-data-definition-statements/index.md',
			},
			{
				text: '13.2 Declarações de manipulação de dados',
				collapsed: true,
				items: [
					{
						text: '13.2.1 Declaração CALL',
						link: '/14-sql-statements/02-data-manipulation-statements/01-c-a-l-l-statement.md',
					},
					{
						text: '13.2.2 Declaração DELETE',
						link: '/14-sql-statements/02-data-manipulation-statements/02-d-e-l-e-t-e-statement.md',
					},
					{
						text: '13.2.3 Declaração do DO',
						link: '/14-sql-statements/02-data-manipulation-statements/03-d-o-statement.md',
					},
					{
						text: '13.2.4 Declaração do Gestor',
						link: '/14-sql-statements/02-data-manipulation-statements/04-h-a-n-d-l-e-r-statement.md',
					},
					{
						text: '13.2.6 Declaração de carregamento de dados',
						link: '/14-sql-statements/02-data-manipulation-statements/06-l-o-a-d-d-a-t-a-statement.md',
					},
					{
						text: '13.2.7 Declaração de CARREGAR XML',
						link: '/14-sql-statements/02-data-manipulation-statements/07-l-o-a-d-x-m-l-statement.md',
					},
					{
						text: '13.2.8 Declaração REPLACE',
						link: '/14-sql-statements/02-data-manipulation-statements/08-r-e-p-l-a-c-e-statement.md',
					},
					{
						text: '13.2.11 Declaração de atualização',
						link: '/14-sql-statements/02-data-manipulation-statements/11-u-p-d-a-t-e-statement.md',
					},
					{
						text: '13.2.5 Instrução INSERT',
						collapsed: true,
						items: [
							{
								text: '13.2.5.1 Inserir ... Instrução SELECT',
								link: '/14-sql-statements/02-data-manipulation-statements/05-i-n-s-e-r-t-statement/01-i-n-s-e-r-t-s-e-l-e-c-t-statement.md',
							},
							{
								text: '13.2.5.2. Inserir ... na declaração DUPLICATE KEY UPDATE',
								link: '/14-sql-statements/02-data-manipulation-statements/05-i-n-s-e-r-t-statement/02-i-n-s-e-r-t-o-n-d-u-p-l-i-c-a-t-e-k-e-y-u-p-d-a-t-e-statement.md',
							},
							{
								text: '13.2.5.3 Declaração de adiamento INSERT',
								link: '/14-sql-statements/02-data-manipulation-statements/05-i-n-s-e-r-t-statement/03-i-n-s-e-r-t-d-e-l-a-y-e-d-statement.md',
							},
						],
						link: '/14-sql-statements/02-data-manipulation-statements/05-i-n-s-e-r-t-statement/index.md',
					},
					{
						text: '13.2.9 Instrução SELECT',
						collapsed: true,
						items: [
							{
								text: '13.2.9.1 Instrução SELECT ... INTO',
								link: '/14-sql-statements/02-data-manipulation-statements/09-s-e-l-e-c-t-statement/01-s-e-l-e-c-t-i-n-t-o-statement.md',
							},
							{
								text: '13.2.9.2 Cláusula de UNIFICAÇÃO',
								link: '/14-sql-statements/02-data-manipulation-statements/09-s-e-l-e-c-t-statement/02-j-o-i-n-clause.md',
							},
							{
								text: '13.2.9.3 Cláusula de UNIÃO',
								link: '/14-sql-statements/02-data-manipulation-statements/09-s-e-l-e-c-t-statement/03-u-n-i-o-n-clause.md',
							},
						],
						link: '/14-sql-statements/02-data-manipulation-statements/09-s-e-l-e-c-t-statement/index.md',
					},
					{
						text: '13.2.10 Subconsultas',
						collapsed: true,
						items: [
							{
								text: '13.2.10.1 Subconsulta como Operando Escalar',
								link: '/14-sql-statements/02-data-manipulation-statements/10-subqueries/01-the-subquery-as-scalar-operand.md',
							},
							{
								text: '13.2.10.2 Comparativos usando subconsultas',
								link: '/14-sql-statements/02-data-manipulation-statements/10-subqueries/02-comparisons-using-subqueries.md',
							},
							{
								text: '13.2.10.3 Subconsultas com ANY, IN ou SOME',
								link: '/14-sql-statements/02-data-manipulation-statements/10-subqueries/03-subqueries-with-any-in-or-some.md',
							},
							{
								text: '13.2.10.4 Subconsultas com ALL',
								link: '/14-sql-statements/02-data-manipulation-statements/10-subqueries/04-subqueries-with-all.md',
							},
							{
								text: '13.2.10.5 Subconsultas de linhas',
								link: '/14-sql-statements/02-data-manipulation-statements/10-subqueries/05-row-subqueries.md',
							},
							{
								text: '13.2.10.6 Subconsultas com EXISTS ou NOT EXISTS',
								link: '/14-sql-statements/02-data-manipulation-statements/10-subqueries/06-subqueries-with-e-x-i-s-t-s-or-n-o-t-exists.md',
							},
							{
								text: '13.2.10.7 Subconsultas Correlacionadas',
								link: '/14-sql-statements/02-data-manipulation-statements/10-subqueries/07-correlated-subqueries.md',
							},
							{
								text: '13.2.10.8 Tabelas Derivadas',
								link: '/14-sql-statements/02-data-manipulation-statements/10-subqueries/08-derived-tables.md',
							},
							{
								text: '13.2.10.9 Erros de subconsultas',
								link: '/14-sql-statements/02-data-manipulation-statements/10-subqueries/09-subquery-errors.md',
							},
							{
								text: '13.2.10.10 Otimizando subconsultas',
								link: '/14-sql-statements/02-data-manipulation-statements/10-subqueries/10-optimizing-subqueries.md',
							},
							{
								text: '13.2.10.11 Reescrever subconsultas como junções',
								link: '/14-sql-statements/02-data-manipulation-statements/10-subqueries/11-rewriting-subqueries-as-joins.md',
							},
							{
								text: '13.2.10.12 Restrições sobre subconsultas',
								link: '/14-sql-statements/02-data-manipulation-statements/10-subqueries/12-restrictions-on-subqueries.md',
							},
						],
						link: '/14-sql-statements/02-data-manipulation-statements/10-subqueries/index.md',
					},
				],
				link: '/14-sql-statements/02-data-manipulation-statements/index.md',
			},
			{
				text: '13.3 Declarações Transacionais e de Bloqueio',
				collapsed: true,
				items: [
					{
						text: '13.3.1 Declarações START TRANSACTION, COMMIT e ROLLBACK',
						link: '/14-sql-statements/03-transactional-and-locking-statements/01-s-t-a-r-t-transaction-commit-and-r-o-l-l-b-a-c-k-statements.md',
					},
					{
						text: '13.3.2 Declarações que não podem ser desfeitas',
						link: '/14-sql-statements/03-transactional-and-locking-statements/02-statements-that-cannot-be-rolled-back.md',
					},
					{
						text: '13.3.3 Declarações que causam um compromisso implícito',
						link: '/14-sql-statements/03-transactional-and-locking-statements/03-statements-that-cause-an-implicit-commit.md',
					},
					{
						text: '13.3.4 Declarações SAVEPOINT, ROLLBACK TO SAVEPOINT e RELEASE SAVEPOINT',
						link: '/14-sql-statements/03-transactional-and-locking-statements/04-savepoint-r-o-l-l-b-a-c-k-t-o-savepoint-and-r-e-l-e-a-s-e-s-a-v-e-p-o-i-n-t-statements.md',
					},
					{
						text: '13.3.5 Declarações LOCK TABLES e UNLOCK TABLES',
						link: '/14-sql-statements/03-transactional-and-locking-statements/05-l-o-c-k-t-a-b-l-e-s-and-u-n-l-o-c-k-t-a-b-l-e-s-statements.md',
					},
					{
						text: '13.3.6 Declaração SET TRANSACTION',
						link: '/14-sql-statements/03-transactional-and-locking-statements/06-s-e-t-t-r-a-n-s-a-c-t-i-o-n-statement.md',
					},
					{
						text: '13.3.7 Transações XA',
						collapsed: true,
						items: [
							{
								text: '13.3.7.1 Instruções SQL de Transação XA',
								link: '/14-sql-statements/03-transactional-and-locking-statements/07-x-a-transactions/01-x-a-transaction-s-q-l-statements.md',
							},
							{
								text: '13.3.7.2 Estados de Transação XA',
								link: '/14-sql-statements/03-transactional-and-locking-statements/07-x-a-transactions/02-x-a-transaction-states.md',
							},
							{
								text: '13.3.7.3 Restrições às Transações XA',
								link: '/14-sql-statements/03-transactional-and-locking-statements/07-x-a-transactions/03-restrictions-on-x-a-transactions.md',
							},
						],
						link: '/14-sql-statements/03-transactional-and-locking-statements/07-x-a-transactions/index.md',
					},
				],
				link: '/14-sql-statements/03-transactional-and-locking-statements/index.md',
			},
			{
				text: '13.4 Declarações de replicação',
				collapsed: true,
				items: [
					{
						text: '13.4.1 Instruções SQL para controlar servidores de origem de replicação',
						collapsed: true,
						items: [
							{
								text: '13.4.1.1 Declaração de PURGE BINARY LOGS',
								link: '/14-sql-statements/04-replication-statements/01-s-q-l-statements-for-controlling-replication-source-servers/01-p-u-r-g-e-b-i-n-a-r-y-l-o-g-s-statement.md',
							},
							{
								text: '13.4.1.2 Declaração de REESTABELECER MASTER',
								link: '/14-sql-statements/04-replication-statements/01-s-q-l-statements-for-controlling-replication-source-servers/02-r-e-s-e-t-m-a-s-t-e-r-statement.md',
							},
							{
								text: '13.4.1.3 Declaração sql_log_bin do SET',
								link: '/14-sql-statements/04-replication-statements/01-s-q-l-statements-for-controlling-replication-source-servers/03-s-e-t-sql-log-bin-statement.md',
							},
						],
						link: '/14-sql-statements/04-replication-statements/01-s-q-l-statements-for-controlling-replication-source-servers/index.md',
					},
					{
						text: '13.4.2 Instruções SQL para controlar servidores de replicação',
						collapsed: true,
						items: [
							{
								text: '13.4.2.1 ALTERAR MASTER PARA Declaração',
								link: '/14-sql-statements/04-replication-statements/02-s-q-l-statements-for-controlling-replica-servers/01-c-h-a-n-g-e-m-a-s-t-e-r-t-o-statement.md',
							},
							{
								text: '13.4.2.2. Declaração do filtro de replicação de alterações',
								link: '/14-sql-statements/04-replication-statements/02-s-q-l-statements-for-controlling-replica-servers/02-c-h-a-n-g-e-r-e-p-l-i-c-a-t-i-o-n-f-i-l-t-e-r-statement.md',
							},
							{
								text: '13.4.2.3 Declaração de RESET SLAVE',
								link: '/14-sql-statements/04-replication-statements/02-s-q-l-statements-for-controlling-replica-servers/03-r-e-s-e-t-s-l-a-v-e-statement.md',
							},
							{
								text: '13.4.2.4 Sintaxe do parâmetro global sql_slave_skip_counter',
								link: '/14-sql-statements/04-replication-statements/02-s-q-l-statements-for-controlling-replica-servers/04-s-e-t-g-l-o-b-a-l-sql-slave-skip-counter-syntax.md',
							},
							{
								text: '13.4.2.5 Declaração de início de escravo',
								link: '/14-sql-statements/04-replication-statements/02-s-q-l-statements-for-controlling-replica-servers/05-s-t-a-r-t-s-l-a-v-e-statement.md',
							},
							{
								text: '13.4.2.6 Declaração de PARAR SLAVE',
								link: '/14-sql-statements/04-replication-statements/02-s-q-l-statements-for-controlling-replica-servers/06-s-t-o-p-s-l-a-v-e-statement.md',
							},
						],
						link: '/14-sql-statements/04-replication-statements/02-s-q-l-statements-for-controlling-replica-servers/index.md',
					},
					{
						text: '13.4.3 Instruções SQL para controlar a replicação em grupo',
						collapsed: true,
						items: [
							{
								text: '13.4.3.1 Declaração do grupo de início de replicação',
								link: '/14-sql-statements/04-replication-statements/03-s-q-l-statements-for-controlling-group-replication/01-s-t-a-r-t-g-r-o-u-p-r-e-p-l-i-c-a-t-i-o-n-statement.md',
							},
							{
								text: '13.4.3.2. Declaração STOP GROUP_REPLICATION',
								link: '/14-sql-statements/04-replication-statements/03-s-q-l-statements-for-controlling-group-replication/02-s-t-o-p-g-r-o-u-p-r-e-p-l-i-c-a-t-i-o-n-statement.md',
							},
						],
						link: '/14-sql-statements/04-replication-statements/03-s-q-l-statements-for-controlling-group-replication/index.md',
					},
				],
				link: '/14-sql-statements/04-replication-statements/index.md',
			},
			{
				text: '13.5 Declarações Preparadas',
				collapsed: true,
				items: [
					{
						text: '13.5.1 Declaração PREPARE',
						link: '/14-sql-statements/05-prepared-statements/01-p-r-e-p-a-r-e-statement.md',
					},
					{
						text: '13.5.2 Declaração EXECUTE',
						link: '/14-sql-statements/05-prepared-statements/02-e-x-e-c-u-t-e-statement.md',
					},
					{
						text: '13.5.3 Declaração de DESALOQUE PREPARAR',
						link: '/14-sql-statements/05-prepared-statements/03-d-e-a-l-l-o-c-a-t-e-p-r-e-p-a-r-e-statement.md',
					},
				],
				link: '/14-sql-statements/05-prepared-statements/index.md',
			},
			{
				text: '13.6. Frases compostas',
				collapsed: true,
				items: [
					{
						text: '13.6.1 COMEÇAR ... FIM Declaração composta',
						link: '/14-sql-statements/06-compound-statements/01-b-e-g-i-n-e-n-d-compound-statement.md',
					},
					{
						text: '13.6.2 Etiquetas de declaração',
						link: '/14-sql-statements/06-compound-statements/02-statement-labels.md',
					},
					{
						text: '13.6.3 Declaração de DECLARE',
						link: '/14-sql-statements/06-compound-statements/03-d-e-c-l-a-r-e-statement.md',
					},
					{
						text: '13.6.4 Variáveis em Programas Armazenados',
						collapsed: true,
						items: [
							{
								text: '13.6.4.1 Declaração de variável local DECLARE',
								link: '/14-sql-statements/06-compound-statements/04-variables-in-stored-programs/01-local-variable-d-e-c-l-a-r-e-statement.md',
							},
							{
								text: '13.6.4.2 Âmbito e resolução de variáveis locais',
								link: '/14-sql-statements/06-compound-statements/04-variables-in-stored-programs/02-local-variable-scope-and-resolution.md',
							},
						],
						link: '/14-sql-statements/06-compound-statements/04-variables-in-stored-programs/index.md',
					},
					{
						text: '13.6.5 Declarações de controle de fluxo',
						collapsed: true,
						items: [
							{
								text: '13.6.5.1 Declaração CASE',
								link: '/14-sql-statements/06-compound-statements/05-flow-control-statements/01-c-a-s-e-statement.md',
							},
							{
								text: '13.6.5.2 Instrução IF',
								link: '/14-sql-statements/06-compound-statements/05-flow-control-statements/02-i-f-statement.md',
							},
							{
								text: '13.6.5.3. Declaração ITERATE',
								link: '/14-sql-statements/06-compound-statements/05-flow-control-statements/03-i-t-e-r-a-t-e-statement.md',
							},
							{
								text: '13.6.5.4 Declaração LEAVE',
								link: '/14-sql-statements/06-compound-statements/05-flow-control-statements/04-l-e-a-v-e-statement.md',
							},
							{
								text: '13.6.5.5 Declaração LOOP',
								link: '/14-sql-statements/06-compound-statements/05-flow-control-statements/05-l-o-o-p-statement.md',
							},
							{
								text: '13.6.5.6 Declaração REPEAT',
								link: '/14-sql-statements/06-compound-statements/05-flow-control-statements/06-r-e-p-e-a-t-statement.md',
							},
							{
								text: '13.6.5.7 Declaração RETURN',
								link: '/14-sql-statements/06-compound-statements/05-flow-control-statements/07-r-e-t-u-r-n-statement.md',
							},
							{
								text: '13.6.5.8 Instrução WHILE',
								link: '/14-sql-statements/06-compound-statements/05-flow-control-statements/08-w-h-i-l-e-statement.md',
							},
						],
						link: '/14-sql-statements/06-compound-statements/05-flow-control-statements/index.md',
					},
					{
						text: '13.6.6 Cursoros',
						collapsed: true,
						items: [
							{
								text: '13.6.6.1 Declaração de cursor CLOSE',
								link: '/14-sql-statements/06-compound-statements/06-cursors/01-cursor-c-l-o-s-e-statement.md',
							},
							{
								text: '13.6.6.2 Declaração `Cursor DECLARE`',
								link: '/14-sql-statements/06-compound-statements/06-cursors/02-cursor-d-e-c-l-a-r-e-statement.md',
							},
							{
								text: '13.6.6.3 Declaração FETCH do cursor',
								link: '/14-sql-statements/06-compound-statements/06-cursors/03-cursor-f-e-t-c-h-statement.md',
							},
							{
								text: '13.6.6.4 Declaração Cursor OPEN',
								link: '/14-sql-statements/06-compound-statements/06-cursors/04-cursor-o-p-e-n-statement.md',
							},
							{
								text: '13.6.6.5 Restrições aos cursors no lado do servidor',
								link: '/14-sql-statements/06-compound-statements/06-cursors/05-restrictions-on-server-side-cursors.md',
							},
						],
						link: '/14-sql-statements/06-compound-statements/06-cursors/index.md',
					},
					{
						text: '13.6.7 Tratamento de Condições',
						collapsed: true,
						items: [
							{
								text: '13.6.7.1 DECLARAR ... Instrução de condição',
								link: '/14-sql-statements/06-compound-statements/07-condition-handling/01-d-e-c-l-a-r-e-c-o-n-d-i-t-i-o-n-statement.md',
							},
							{
								text: '13.6.7.2 DECLARAR ... declaração do manipulador',
								link: '/14-sql-statements/06-compound-statements/07-condition-handling/02-d-e-c-l-a-r-e-h-a-n-d-l-e-r-statement.md',
							},
							{
								text: '13.6.7.3. Declaração de DIAGNÓSTICO',
								link: '/14-sql-statements/06-compound-statements/07-condition-handling/03-g-e-t-d-i-a-g-n-o-s-t-i-c-s-statement.md',
							},
							{
								text: '13.6.7.4 Declaração RESIGNAL',
								link: '/14-sql-statements/06-compound-statements/07-condition-handling/04-r-e-s-i-g-n-a-l-statement.md',
							},
							{
								text: '13.6.7.5 Declaração de Sinal',
								link: '/14-sql-statements/06-compound-statements/07-condition-handling/05-s-i-g-n-a-l-statement.md',
							},
							{
								text: '13.6.7.6 Regras de escopo para manipuladores',
								link: '/14-sql-statements/06-compound-statements/07-condition-handling/06-scope-rules-for-handlers.md',
							},
							{
								text: '13.6.7.7. Área de Diagnóstico do MySQL',
								link: '/14-sql-statements/06-compound-statements/07-condition-handling/07-the-my-s-q-l-diagnostics-area.md',
							},
							{
								text: '13.6.7.8 Gerenciamento de Condições e Parâmetros OUT ou INOUT',
								link: '/14-sql-statements/06-compound-statements/07-condition-handling/08-condition-handling-and-o-u-t-or-i-n-o-u-t-parameters.md',
							},
							{
								text: '13.6.7.9 Restrições para o manuseio de condições',
								link: '/14-sql-statements/06-compound-statements/07-condition-handling/09-restrictions-on-condition-handling.md',
							},
						],
						link: '/14-sql-statements/06-compound-statements/07-condition-handling/index.md',
					},
				],
				link: '/14-sql-statements/06-compound-statements/index.md',
			},
			{
				text: '13.7 Declarações de Administração de Banco de Dados',
				collapsed: true,
				items: [
					{
						text: '13.7.1 Demonstrações de Gestão de Conta',
						collapsed: true,
						items: [
							{
								text: '13.7.1.1 Declaração ALTER USER',
								link: '/14-sql-statements/07-database-administration-statements/01-account-management-statements/01-a-l-t-e-r-u-s-e-r-statement.md',
							},
							{
								text: '13.7.1.2 Declaração CREATE USER',
								link: '/14-sql-statements/07-database-administration-statements/01-account-management-statements/02-c-r-e-a-t-e-u-s-e-r-statement.md',
							},
							{
								text: '13.7.1.3 Declaração DROP USER',
								link: '/14-sql-statements/07-database-administration-statements/01-account-management-statements/03-d-r-o-p-u-s-e-r-statement.md',
							},
							{
								text: '13.7.1.4 Declaração de concessão',
								link: '/14-sql-statements/07-database-administration-statements/01-account-management-statements/04-g-r-a-n-t-statement.md',
							},
							{
								text: '13.7.1.5 Declaração de RENOMEAR USUÁRIO',
								link: '/14-sql-statements/07-database-administration-statements/01-account-management-statements/05-r-e-n-a-m-e-u-s-e-r-statement.md',
							},
							{
								text: '13.7.1.6 Declaração de REVOGAÇÃO',
								link: '/14-sql-statements/07-database-administration-statements/01-account-management-statements/06-r-e-v-o-k-e-statement.md',
							},
							{
								text: '13.7.1.7 Declaração de definir senha',
								link: '/14-sql-statements/07-database-administration-statements/01-account-management-statements/07-s-e-t-p-a-s-s-w-o-r-d-statement.md',
							},
						],
						link: '/14-sql-statements/07-database-administration-statements/01-account-management-statements/index.md',
					},
					{
						text: '13.7.2 Declarações de manutenção da tabela',
						collapsed: true,
						items: [
							{
								text: '13.7.2.1 Declaração de Tabela de Análise',
								link: '/14-sql-statements/07-database-administration-statements/02-table-maintenance-statements/01-a-n-a-l-y-z-e-t-a-b-l-e-statement.md',
							},
							{
								text: '13.7.2.2. Declaração de tabela de verificação',
								link: '/14-sql-statements/07-database-administration-statements/02-table-maintenance-statements/02-c-h-e-c-k-t-a-b-l-e-statement.md',
							},
							{
								text: '13.7.2.3 Declaração da Tabela CHECKSUM',
								link: '/14-sql-statements/07-database-administration-statements/02-table-maintenance-statements/03-c-h-e-c-k-s-u-m-t-a-b-l-e-statement.md',
							},
							{
								text: '13.7.2.4 Declaração de Otimização da Tabela',
								link: '/14-sql-statements/07-database-administration-statements/02-table-maintenance-statements/04-o-p-t-i-m-i-z-e-t-a-b-l-e-statement.md',
							},
							{
								text: '13.7.2.5 Declaração de REPARO DE TÁBUA',
								link: '/14-sql-statements/07-database-administration-statements/02-table-maintenance-statements/05-r-e-p-a-i-r-t-a-b-l-e-statement.md',
							},
						],
						link: '/14-sql-statements/07-database-administration-statements/02-table-maintenance-statements/index.md',
					},
					{
						text: '13.7.3 Declarações de Funções e Plugins Carregáveis',
						collapsed: true,
						items: [
							{
								text: '13.7.3.1 Declaração CREATE FUNCTION para funções carregáveis',
								link: '/14-sql-statements/07-database-administration-statements/03-plugin-and-loadable-function-statements/01-c-r-e-a-t-e-f-u-n-c-t-i-o-n-statement-for-loadable-functions.md',
							},
							{
								text: '13.7.3.2 Declaração da função DROP para funções carregáveis',
								link: '/14-sql-statements/07-database-administration-statements/03-plugin-and-loadable-function-statements/02-d-r-o-p-f-u-n-c-t-i-o-n-statement-for-loadable-functions.md',
							},
							{
								text: '13.7.3.3. Declaração de INSTALAÇÃO DE PLUGIN',
								link: '/14-sql-statements/07-database-administration-statements/03-plugin-and-loadable-function-statements/03-i-n-s-t-a-l-l-p-l-u-g-i-n-statement.md',
							},
							{
								text: '13.7.3.4. Declaração de DESINSTALAR PLUGIN',
								link: '/14-sql-statements/07-database-administration-statements/03-plugin-and-loadable-function-statements/04-u-n-i-n-s-t-a-l-l-p-l-u-g-i-n-statement.md',
							},
						],
						link: '/14-sql-statements/07-database-administration-statements/03-plugin-and-loadable-function-statements/index.md',
					},
					{
						text: '13.7.4 Declarações SET',
						collapsed: true,
						items: [
							{
								text: '13.7.4.1 Sintaxe de definição de variáveis para atribuição',
								link: '/14-sql-statements/07-database-administration-statements/04-s-e-t-statements/01-s-e-t-syntax-for-variable-assignment.md',
							},
							{
								text: '13.7.4.2 Declaração de conjunto de caracteres de definição',
								link: '/14-sql-statements/07-database-administration-statements/04-s-e-t-statements/02-s-e-t-c-h-a-r-a-c-t-e-r-s-e-t-statement.md',
							},
							{
								text: '13.7.4.3 Declaração de NOME_SET',
								link: '/14-sql-statements/07-database-administration-statements/04-s-e-t-statements/03-s-e-t-n-a-m-e-s-statement.md',
							},
						],
						link: '/14-sql-statements/07-database-administration-statements/04-s-e-t-statements/index.md',
					},
					{
						text: '13.7.5 Declarações SHOW',
						collapsed: true,
						items: [
							{
								text: '13.7.5.1 Declaração de registro binário de exibição',
								link: '/14-sql-statements/07-database-administration-statements/05-s-h-o-w-statements/01-s-h-o-w-b-i-n-a-r-y-l-o-g-s-statement.md',
							},
							{
								text: '13.7.5.2. Mostrar eventos do BINLOG Statement',
								link: '/14-sql-statements/07-database-administration-statements/05-s-h-o-w-statements/02-s-h-o-w-b-i-n-l-o-g-e-v-e-n-t-s-statement.md',
							},
							{
								text: '13.7.5.3. Declaração de Caracteres do Conjunto',
								link: '/14-sql-statements/07-database-administration-statements/05-s-h-o-w-statements/03-s-h-o-w-c-h-a-r-a-c-t-e-r-s-e-t-statement.md',
							},
							{
								text: '13.7.5.4 Declaração de COLAÇÃO DE MOSTRA',
								link: '/14-sql-statements/07-database-administration-statements/05-s-h-o-w-statements/04-s-h-o-w-c-o-l-l-a-t-i-o-n-statement.md',
							},
							{
								text: '13.7.5.5. Declaração COLUMNS',
								link: '/14-sql-statements/07-database-administration-statements/05-s-h-o-w-statements/05-s-h-o-w-c-o-l-u-m-n-s-statement.md',
							},
							{
								text: '13.7.5.6 Declaração `SHOW CREATE DATABASE`',
								link: '/14-sql-statements/07-database-administration-statements/05-s-h-o-w-statements/06-s-h-o-w-c-r-e-a-t-e-d-a-t-a-b-a-s-e-statement.md',
							},
							{
								text: '13.7.5.7. Declaração SHOW CREATE EVENT EVENT',
								link: '/14-sql-statements/07-database-administration-statements/05-s-h-o-w-statements/07-s-h-o-w-c-r-e-a-t-e-e-v-e-n-t-statement.md',
							},
							{
								text: '13.7.5.8. Declaração `SHOW CREATE FUNCTION`',
								link: '/14-sql-statements/07-database-administration-statements/05-s-h-o-w-statements/08-s-h-o-w-c-r-e-a-t-e-f-u-n-c-t-i-o-n-statement.md',
							},
							{
								text: '13.7.5.9 Declaração `SHOW CREATE PROCEDURE`',
								link: '/14-sql-statements/07-database-administration-statements/05-s-h-o-w-statements/09-s-h-o-w-c-r-e-a-t-e-p-r-o-c-e-d-u-r-e-statement.md',
							},
							{
								text: '13.7.5.10 Mostrar a declaração CREATE TABLE',
								link: '/14-sql-statements/07-database-administration-statements/05-s-h-o-w-statements/10-s-h-o-w-c-r-e-a-t-e-t-a-b-l-e-statement.md',
							},
							{
								text: '13.7.5.11 Declaração `SHOW CREATE TRIGGER`',
								link: '/14-sql-statements/07-database-administration-statements/05-s-h-o-w-statements/11-s-h-o-w-c-r-e-a-t-e-t-r-i-g-g-e-r-statement.md',
							},
							{
								text: '13.7.5.12 Declaração SHOW CREATE USER',
								link: '/14-sql-statements/07-database-administration-statements/05-s-h-o-w-statements/12-s-h-o-w-c-r-e-a-t-e-u-s-e-r-statement.md',
							},
							{
								text: '13.7.5.13 Declaração `SHOW CREATE VIEW`',
								link: '/14-sql-statements/07-database-administration-statements/05-s-h-o-w-statements/13-s-h-o-w-c-r-e-a-t-e-v-i-e-w-statement.md',
							},
							{
								text: '13.7.5.14 Mostrar bancos de dados Statement',
								link: '/14-sql-statements/07-database-administration-statements/05-s-h-o-w-statements/14-s-h-o-w-d-a-t-a-b-a-s-e-s-statement.md',
							},
							{
								text: '13.7.5.15 Declaração do motor de exibição',
								link: '/14-sql-statements/07-database-administration-statements/05-s-h-o-w-statements/15-s-h-o-w-e-n-g-i-n-e-statement.md',
							},
							{
								text: '13.7.5.16. DECLARAÇÃO DOS MOTORES DE EXIBIÇÃO',
								link: '/14-sql-statements/07-database-administration-statements/05-s-h-o-w-statements/16-s-h-o-w-e-n-g-i-n-e-s-statement.md',
							},
							{
								text: '13.7.5.17 Declaração de exibição de erros',
								link: '/14-sql-statements/07-database-administration-statements/05-s-h-o-w-statements/17-s-h-o-w-e-r-r-o-r-s-statement.md',
							},
							{
								text: '13.7.5.18 DESCRIÇÃO DOS EVENTOS DE EXPOSIÇÃO',
								link: '/14-sql-statements/07-database-administration-statements/05-s-h-o-w-statements/18-s-h-o-w-e-v-e-n-t-s-statement.md',
							},
							{
								text: '13.7.5.19 Mostrar código da função Statement',
								link: '/14-sql-statements/07-database-administration-statements/05-s-h-o-w-statements/19-s-h-o-w-f-u-n-c-t-i-o-n-c-o-d-e-statement.md',
							},
							{
								text: '13.7.5.20 Mostrar o status da função Mensagem',
								link: '/14-sql-statements/07-database-administration-statements/05-s-h-o-w-statements/20-s-h-o-w-f-u-n-c-t-i-o-n-s-t-a-t-u-s-statement.md',
							},
							{
								text: '13.7.5.21 Declaração de GRANTS SHOW',
								link: '/14-sql-statements/07-database-administration-statements/05-s-h-o-w-statements/21-s-h-o-w-g-r-a-n-t-s-statement.md',
							},
							{
								text: '13.7.5.22 Declaração de índice de exibição',
								link: '/14-sql-statements/07-database-administration-statements/05-s-h-o-w-statements/22-s-h-o-w-i-n-d-e-x-statement.md',
							},
							{
								text: '13.7.5.23 Declaração de status do mestre',
								link: '/14-sql-statements/07-database-administration-statements/05-s-h-o-w-statements/23-s-h-o-w-m-a-s-t-e-r-s-t-a-t-u-s-statement.md',
							},
							{
								text: '13.7.5.24. Mostrar mesas disponíveis',
								link: '/14-sql-statements/07-database-administration-statements/05-s-h-o-w-statements/24-s-h-o-w-o-p-e-n-t-a-b-l-e-s-statement.md',
							},
							{
								text: '13.7.5.25. EXIBIR PLUGINS Declaração',
								link: '/14-sql-statements/07-database-administration-statements/05-s-h-o-w-statements/25-s-h-o-w-p-l-u-g-i-n-s-statement.md',
							},
							{
								text: '13.7.5.26 Declaração de PRÉMIOS DE MOSTRA',
								link: '/14-sql-statements/07-database-administration-statements/05-s-h-o-w-statements/26-s-h-o-w-p-r-i-v-i-l-e-g-e-s-statement.md',
							},
							{
								text: '13.7.5.27. EXIBIR CÓDIGO DO PROCEDIMENTO Declaração',
								link: '/14-sql-statements/07-database-administration-statements/05-s-h-o-w-statements/27-s-h-o-w-p-r-o-c-e-d-u-r-e-c-o-d-e-statement.md',
							},
							{
								text: '13.7.5.28 Mostrar o status do procedimento Declaração',
								link: '/14-sql-statements/07-database-administration-statements/05-s-h-o-w-statements/28-s-h-o-w-p-r-o-c-e-d-u-r-e-s-t-a-t-u-s-statement.md',
							},
							{
								text: '13.7.5.29 Declaração PROCESSLIST',
								link: '/14-sql-statements/07-database-administration-statements/05-s-h-o-w-statements/29-s-h-o-w-p-r-o-c-e-s-s-l-i-s-t-statement.md',
							},
							{
								text: '13.7.5.30 Mostrar perfil de declaração',
								link: '/14-sql-statements/07-database-administration-statements/05-s-h-o-w-statements/30-s-h-o-w-p-r-o-f-i-l-e-statement.md',
							},
							{
								text: '13.7.5.31 Mostrar perfis de declaração',
								link: '/14-sql-statements/07-database-administration-statements/05-s-h-o-w-statements/31-s-h-o-w-p-r-o-f-i-l-e-s-statement.md',
							},
							{
								text: '13.7.5.32 Mostrar eventos do RELAYLOG Declaração',
								link: '/14-sql-statements/07-database-administration-statements/05-s-h-o-w-statements/32-s-h-o-w-r-e-l-a-y-l-o-g-e-v-e-n-t-s-statement.md',
							},
							{
								text: '13.7.5.33 Mostrar anfitriões escravos Declaração',
								link: '/14-sql-statements/07-database-administration-statements/05-s-h-o-w-statements/33-s-h-o-w-s-l-a-v-e-h-o-s-t-s-statement.md',
							},
							{
								text: '13.7.5.34 Declaração de exibição do status do escravo',
								link: '/14-sql-statements/07-database-administration-statements/05-s-h-o-w-statements/34-s-h-o-w-s-l-a-v-e-s-t-a-t-u-s-statement.md',
							},
							{
								text: '13.7.5.35 Declaração de ESTADO DE SITUAÇÃO',
								link: '/14-sql-statements/07-database-administration-statements/05-s-h-o-w-statements/35-s-h-o-w-s-t-a-t-u-s-statement.md',
							},
							{
								text: '13.7.5.36 Declaração de Status da Tabela',
								link: '/14-sql-statements/07-database-administration-statements/05-s-h-o-w-statements/36-s-h-o-w-t-a-b-l-e-s-t-a-t-u-s-statement.md',
							},
							{
								text: '13.7.5.37 Declaração SHOW TABLES',
								link: '/14-sql-statements/07-database-administration-statements/05-s-h-o-w-statements/37-s-h-o-w-t-a-b-l-e-s-statement.md',
							},
							{
								text: '13.7.5.38. EXIBIR TRIGGERS Statement',
								link: '/14-sql-statements/07-database-administration-statements/05-s-h-o-w-statements/38-s-h-o-w-t-r-i-g-g-e-r-s-statement.md',
							},
							{
								text: '13.7.5.39 Declaração de VARIÁVEIS EXIBIR',
								link: '/14-sql-statements/07-database-administration-statements/05-s-h-o-w-statements/39-s-h-o-w-v-a-r-i-a-b-l-e-s-statement.md',
							},
							{
								text: '13.7.5.40 Mostrar avisos Statement',
								link: '/14-sql-statements/07-database-administration-statements/05-s-h-o-w-statements/40-s-h-o-w-w-a-r-n-i-n-g-s-statement.md',
							},
						],
						link: '/14-sql-statements/07-database-administration-statements/05-s-h-o-w-statements/index.md',
					},
					{
						text: '13.7.6 Outras declarações administrativas',
						collapsed: true,
						items: [
							{
								text: '13.7.6.1 Declaração BINLOG',
								link: '/14-sql-statements/07-database-administration-statements/06-other-administrative-statements/01-b-i-n-l-o-g-statement.md',
							},
							{
								text: '13.7.6.2 Declaração de ÍNDICE DE CACHE',
								link: '/14-sql-statements/07-database-administration-statements/06-other-administrative-statements/02-c-a-c-h-e-i-n-d-e-x-statement.md',
							},
							{
								text: '13.7.6.3 Declaração FLUSH',
								link: '/14-sql-statements/07-database-administration-statements/06-other-administrative-statements/03-f-l-u-s-h-statement.md',
							},
							{
								text: '13.7.6.4 Declaração de eliminação',
								link: '/14-sql-statements/07-database-administration-statements/06-other-administrative-statements/04-k-i-l-l-statement.md',
							},
							{
								text: '13.7.6.5. Declaração de carregamento de índice em cache',
								link: '/14-sql-statements/07-database-administration-statements/06-other-administrative-statements/05-l-o-a-d-i-n-d-e-x-i-n-t-o-c-a-c-h-e-statement.md',
							},
							{
								text: '13.7.6.6 Declaração de RESET',
								link: '/14-sql-statements/07-database-administration-statements/06-other-administrative-statements/06-r-e-s-e-t-statement.md',
							},
							{
								text: '13.7.6.7 Declaração de ENCERRAMENTO',
								link: '/14-sql-statements/07-database-administration-statements/06-other-administrative-statements/07-s-h-u-t-d-o-w-n-statement.md',
							},
						],
						link: '/14-sql-statements/07-database-administration-statements/06-other-administrative-statements/index.md',
					},
				],
				link: '/14-sql-statements/07-database-administration-statements/index.md',
			},
			{
				text: '13.8 Demonstrações de Utilidade',
				collapsed: true,
				items: [
					{
						text: '13.8.1 Declaração DESCRIBE',
						link: '/14-sql-statements/08-utility-statements/01-d-e-s-c-r-i-b-e-statement.md',
					},
					{
						text: '13.8.2 Instrução EXPLAIN',
						link: '/14-sql-statements/08-utility-statements/02-e-x-p-l-a-i-n-statement.md',
					},
					{
						text: '13.8.3 Declaração de Ajuda',
						link: '/14-sql-statements/08-utility-statements/03-h-e-l-p-statement.md',
					},
					{
						text: '13.8.4 Declaração de uso',
						link: '/14-sql-statements/08-utility-statements/04-u-s-e-statement.md',
					},
				],
				link: '/14-sql-statements/08-utility-statements/index.md',
			},
		],
		link: '/14-sql-statements/index.md',
	},
	{
		text: 'Capítulo 14 O Motor de Armazenamento InnoDB',
		collapsed: true,
		items: [
			{
				text: '14.2 InnoDB e o Modelo ACID',
				link: '/15-the-innodb-storage-engine/02-inno-d-b-and-the-a-c-i-d-model.md',
			},
			{
				text: '14.3 Multiversão do InnoDB',
				link: '/15-the-innodb-storage-engine/03-inno-d-b-multi-versioning.md',
			},
			{
				text: '14.4 Arquitetura do InnoDB',
				link: '/15-the-innodb-storage-engine/04-inno-d-b-architecture.md',
			},
			{
				text: '14.11 Formatos de Linhas do InnoDB',
				link: '/15-the-innodb-storage-engine/11-inno-d-b-row-formats.md',
			},
			{
				text: '14.14 Criptografia de Dados em Repouso do InnoDB',
				link: '/15-the-innodb-storage-engine/14-inno-d-b-data-at-rest-encryption.md',
			},
			{
				text: '14.15 Opções de inicialização do InnoDB e variáveis do sistema',
				link: '/15-the-innodb-storage-engine/15-inno-d-b-startup-options-and-system-variables.md',
			},
			{
				text: '14.20 InnoDB e replicação do MySQL',
				link: '/15-the-innodb-storage-engine/20-inno-d-b-and-my-s-q-l-replication.md',
			},
			{
				text: '14.23 Limites do InnoDB',
				link: '/15-the-innodb-storage-engine/23-inno-d-b-limits.md',
			},
			{
				text: '14.24 Restrições e Limitações do InnoDB',
				link: '/15-the-innodb-storage-engine/24-inno-d-b-restrictions-and-limitations.md',
			},
			{
				text: '14.1 Introdução ao InnoDB',
				collapsed: true,
				items: [
					{
						text: '14.1.1 Benefícios de usar tabelas InnoDB',
						link: '/15-the-innodb-storage-engine/01-introduction-to-inno-db/01-benefits-of-using-inno-d-b-tables.md',
					},
					{
						text: '14.1.2 Melhores Práticas para Tabelas InnoDB',
						link: '/15-the-innodb-storage-engine/01-introduction-to-inno-db/02-best-practices-for-inno-d-b-tables.md',
					},
					{
						text: '14.1.3 Verificar se o InnoDB é o motor de armazenamento padrão',
						link: '/15-the-innodb-storage-engine/01-introduction-to-inno-db/03-verifying-that-inno-d-b-is-the-default-storage-engine.md',
					},
					{
						text: '14.1.4 Testes e Benchmarking com InnoDB',
						link: '/15-the-innodb-storage-engine/01-introduction-to-inno-db/04-testing-and-benchmarking-with-inno-db.md',
					},
					{
						text: '14.1.5 Desligando o InnoDB',
						link: '/15-the-innodb-storage-engine/01-introduction-to-inno-db/05-turning-off-inno-db.md',
					},
				],
				link: '/15-the-innodb-storage-engine/01-introduction-to-inno-db/index.md',
			},
			{
				text: '14.5 Estruturas em Memória Dinâmica do InnoDB',
				collapsed: true,
				items: [
					{
						text: '14.5.1 Pool de tampão',
						link: '/15-the-innodb-storage-engine/05-inno-d-b-in-memory-structures/01-buffer-pool.md',
					},
					{
						text: '14.5.2 Buffer de alteração',
						link: '/15-the-innodb-storage-engine/05-inno-d-b-in-memory-structures/02-change-buffer.md',
					},
					{
						text: '14.5.3 Índice de Hash Adaptativo',
						link: '/15-the-innodb-storage-engine/05-inno-d-b-in-memory-structures/03-adaptive-hash-index.md',
					},
					{
						text: '14.5.4 Buffer de registro',
						link: '/15-the-innodb-storage-engine/05-inno-d-b-in-memory-structures/04-log-buffer.md',
					},
				],
				link: '/15-the-innodb-storage-engine/05-inno-d-b-in-memory-structures/index.md',
			},
			{
				text: '14.6. Estruturas de disco do InnoDB',
				collapsed: true,
				items: [
					{
						text: '14.6.4 Dicionário de Dados InnoDB',
						link: '/15-the-innodb-storage-engine/06-inno-d-b-on-disk-structures/04-inno-d-b-data-dictionary.md',
					},
					{
						text: '14.6.5 Buffer de escrita dupla',
						link: '/15-the-innodb-storage-engine/06-inno-d-b-on-disk-structures/05-doublewrite-buffer.md',
					},
					{
						text: '14.6.6 Registro de Refazer',
						link: '/15-the-innodb-storage-engine/06-inno-d-b-on-disk-structures/06-redo-log.md',
					},
					{
						text: '14.6.7 Registros de Desfazer',
						link: '/15-the-innodb-storage-engine/06-inno-d-b-on-disk-structures/07-undo-logs.md',
					},
					{
						text: '14.6.1 Tabelas',
						collapsed: true,
						items: [
							{
								text: '14.6.1.1 Criando tabelas InnoDB',
								link: '/15-the-innodb-storage-engine/06-inno-d-b-on-disk-structures/01-tables/01-creating-inno-d-b-tables.md',
							},
							{
								text: '14.6.1.2 Criar tabelas externamente',
								link: '/15-the-innodb-storage-engine/06-inno-d-b-on-disk-structures/01-tables/02-creating-tables-externally.md',
							},
							{
								text: '14.6.1.3 Impor tabelas InnoDB',
								link: '/15-the-innodb-storage-engine/06-inno-d-b-on-disk-structures/01-tables/03-importing-inno-d-b-tables.md',
							},
							{
								text: '14.6.1.4 Movimentando ou copiando tabelas InnoDB',
								link: '/15-the-innodb-storage-engine/06-inno-d-b-on-disk-structures/01-tables/04-moving-or-copying-inno-d-b-tables.md',
							},
							{
								text: '14.6.1.5 Converter tabelas de MyISAM para InnoDB',
								link: '/15-the-innodb-storage-engine/06-inno-d-b-on-disk-structures/01-tables/05-converting-tables-from-my-i-s-a-m-to-inno-db.md',
							},
							{
								text: '14.6.1.6 Gerenciamento de AUTO_INCREMENT no InnoDB',
								link: '/15-the-innodb-storage-engine/06-inno-d-b-on-disk-structures/01-tables/06-a-u-t-o-i-n-c-r-e-m-e-n-t-handling-in-inno-db.md',
							},
						],
						link: '/15-the-innodb-storage-engine/06-inno-d-b-on-disk-structures/01-tables/index.md',
					},
					{
						text: '14.6.2 Índices',
						collapsed: true,
						items: [
							{
								text: '14.6.2.1 Indekses agrupados e secundários',
								link: '/15-the-innodb-storage-engine/06-inno-d-b-on-disk-structures/02-indexes/01-clustered-and-secondary-indexes.md',
							},
							{
								text: '14.6.2.2. A Estrutura Física de um Índex InnoDB',
								link: '/15-the-innodb-storage-engine/06-inno-d-b-on-disk-structures/02-indexes/02-the-physical-structure-of-an-inno-d-b-index.md',
							},
							{
								text: '14.6.2.3 Construção de índices ordenados',
								link: '/15-the-innodb-storage-engine/06-inno-d-b-on-disk-structures/02-indexes/03-sorted-index-builds.md',
							},
							{
								text: '14.6.2.4 Índices de Texto Completo InnoDB',
								link: '/15-the-innodb-storage-engine/06-inno-d-b-on-disk-structures/02-indexes/04-inno-d-b-full-text-indexes.md',
							},
						],
						link: '/15-the-innodb-storage-engine/06-inno-d-b-on-disk-structures/02-indexes/index.md',
					},
					{
						text: '14.6.3 Tablespaces',
						collapsed: true,
						items: [
							{
								text: '14.6.3.1 Espaço de Tabela do Sistema',
								link: '/15-the-innodb-storage-engine/06-inno-d-b-on-disk-structures/03-tablespaces/01-the-system-tablespace.md',
							},
							{
								text: '14.6.3.2 Espaços de tabela por arquivo',
								link: '/15-the-innodb-storage-engine/06-inno-d-b-on-disk-structures/03-tablespaces/02-file-per-table-tablespaces.md',
							},
							{
								text: '14.6.3.3 Tabelaspaces Gerais',
								link: '/15-the-innodb-storage-engine/06-inno-d-b-on-disk-structures/03-tablespaces/03-general-tablespaces.md',
							},
							{
								text: '14.6.3.4 Refazer Espaços de Tabela',
								link: '/15-the-innodb-storage-engine/06-inno-d-b-on-disk-structures/03-tablespaces/04-undo-tablespaces.md',
							},
							{
								text: '14.6.3.5. O Espaço de Memória Temporário',
								link: '/15-the-innodb-storage-engine/06-inno-d-b-on-disk-structures/03-tablespaces/05-the-temporary-tablespace.md',
							},
						],
						link: '/15-the-innodb-storage-engine/06-inno-d-b-on-disk-structures/03-tablespaces/index.md',
					},
				],
				link: '/15-the-innodb-storage-engine/06-inno-d-b-on-disk-structures/index.md',
			},
			{
				text: '14.7 Modelo de Transição e Bloqueio do InnoDB',
				collapsed: true,
				items: [
					{
						text: '14.7.1 Bloqueio do InnoDB',
						link: '/15-the-innodb-storage-engine/07-inno-d-b-locking-and-transaction-model/01-inno-d-b-locking.md',
					},
					{
						text: '14.7.3 Lås definidos por diferentes instruções SQL no InnoDB',
						link: '/15-the-innodb-storage-engine/07-inno-d-b-locking-and-transaction-model/03-locks-set-by-different-s-q-l-statements-in-inno-db.md',
					},
					{
						text: '14.7.4 Linhas Fantoma',
						link: '/15-the-innodb-storage-engine/07-inno-d-b-locking-and-transaction-model/04-phantom-rows.md',
					},
					{
						text: '14.7.2 Modelo de Transação InnoDB',
						collapsed: true,
						items: [
							{
								text: '14.7.2.1 Níveis de Isolamento de Transações',
								link: '/15-the-innodb-storage-engine/07-inno-d-b-locking-and-transaction-model/02-inno-d-b-transaction-model/01-transaction-isolation-levels.md',
							},
							{
								text: '14.7.2.2 autocommit, Commit e Rollback',
								link: '/15-the-innodb-storage-engine/07-inno-d-b-locking-and-transaction-model/02-inno-d-b-transaction-model/02-autocommit-commit-and-rollback.md',
							},
							{
								text: '14.7.2.3 Leitura consistente sem bloqueio',
								link: '/15-the-innodb-storage-engine/07-inno-d-b-locking-and-transaction-model/02-inno-d-b-transaction-model/03-consistent-nonlocking-reads.md',
							},
							{
								text: '14.7.2.4 Leitura de bloqueio',
								link: '/15-the-innodb-storage-engine/07-inno-d-b-locking-and-transaction-model/02-inno-d-b-transaction-model/04-locking-reads.md',
							},
						],
						link: '/15-the-innodb-storage-engine/07-inno-d-b-locking-and-transaction-model/02-inno-d-b-transaction-model/index.md',
					},
					{
						text: '14.7.5 Bloqueios em InnoDB',
						collapsed: true,
						items: [
							{
								text: '14.7.5.1 Um exemplo de bloqueio de deadlock no InnoDB',
								link: '/15-the-innodb-storage-engine/07-inno-d-b-locking-and-transaction-model/05-deadlocks-in-inno-db/01-an-inno-d-b-deadlock-example.md',
							},
							{
								text: '14.7.5.2 Detecção de Congelamento',
								link: '/15-the-innodb-storage-engine/07-inno-d-b-locking-and-transaction-model/05-deadlocks-in-inno-db/02-deadlock-detection.md',
							},
							{
								text: '14.7.5.3 Como minimizar e lidar com bloqueios',
								link: '/15-the-innodb-storage-engine/07-inno-d-b-locking-and-transaction-model/05-deadlocks-in-inno-db/03-how-to-minimize-and-handle-deadlocks.md',
							},
						],
						link: '/15-the-innodb-storage-engine/07-inno-d-b-locking-and-transaction-model/05-deadlocks-in-inno-db/index.md',
					},
				],
				link: '/15-the-innodb-storage-engine/07-inno-d-b-locking-and-transaction-model/index.md',
			},
			{
				text: '14.8 Configuração do InnoDB',
				collapsed: true,
				items: [
					{
						text: '14.8.1 Configuração de inicialização do InnoDB',
						link: '/15-the-innodb-storage-engine/08-inno-d-b-configuration/01-inno-d-b-startup-configuration.md',
					},
					{
						text: '14.8.2 Configurando o InnoDB para operação de leitura somente',
						link: '/15-the-innodb-storage-engine/08-inno-d-b-configuration/02-configuring-inno-d-b-for-read-only-operation.md',
					},
					{
						text: '14.8.4 Configurando o alocador de memória para o InnoDB',
						link: '/15-the-innodb-storage-engine/08-inno-d-b-configuration/04-configuring-the-memory-allocator-for-inno-db.md',
					},
					{
						text: '14.8.5 Configurando Concorrência de Fila para InnoDB',
						link: '/15-the-innodb-storage-engine/08-inno-d-b-configuration/05-configuring-thread-concurrency-for-inno-db.md',
					},
					{
						text: '14.8.6 Configurando o número de threads de E/S do InnoDB em segundo plano',
						link: '/15-the-innodb-storage-engine/08-inno-d-b-configuration/06-configuring-the-number-of-background-inno-d-b-i-o-threads.md',
					},
					{
						text: '14.8.7 Usar E/S assíncrona no Linux',
						link: '/15-the-innodb-storage-engine/08-inno-d-b-configuration/07-using-asynchronous-i-o-on-linux.md',
					},
					{
						text: '14.8.8 Configurando a capacidade de E/S do InnoDB',
						link: '/15-the-innodb-storage-engine/08-inno-d-b-configuration/08-configuring-inno-d-b-i-o-capacity.md',
					},
					{
						text: '14.8.9 Configurando a Pesquisa de Bloqueio por Rotação',
						link: '/15-the-innodb-storage-engine/08-inno-d-b-configuration/09-configuring-spin-lock-polling.md',
					},
					{
						text: '14.8.10 Configuração de purga',
						link: '/15-the-innodb-storage-engine/08-inno-d-b-configuration/10-purge-configuration.md',
					},
					{
						text: '14.8.12 Configurando o Limiar de Fusão para Páginas de Índice',
						link: '/15-the-innodb-storage-engine/08-inno-d-b-configuration/12-configuring-the-merge-threshold-for-index-pages.md',
					},
					{
						text: '14.8.3 Configuração do Pool de Buffer do InnoDB',
						collapsed: true,
						items: [
							{
								text: '14.8.3.1 Configurando o tamanho do pool de buffers do InnoDB',
								link: '/15-the-innodb-storage-engine/08-inno-d-b-configuration/03-inno-d-b-buffer-pool-configuration/01-configuring-inno-d-b-buffer-pool-size.md',
							},
							{
								text: '14.8.3.2 Configurando múltiplas instâncias do pool de buffers',
								link: '/15-the-innodb-storage-engine/08-inno-d-b-configuration/03-inno-d-b-buffer-pool-configuration/02-configuring-multiple-buffer-pool-instances.md',
							},
							{
								text: '14.8.3.3 Tornar o escaneamento do Pool de Buffer resistente',
								link: '/15-the-innodb-storage-engine/08-inno-d-b-configuration/03-inno-d-b-buffer-pool-configuration/03-making-the-buffer-pool-scan-resistant.md',
							},
							{
								text: '14.8.3.4 Configurando o Prefetching (leitura antecipada) do Pool de Buffer do InnoDB',
								link: '/15-the-innodb-storage-engine/08-inno-d-b-configuration/03-inno-d-b-buffer-pool-configuration/04-configuring-inno-d-b-buffer-pool-prefetching-read-ahead.md',
							},
							{
								text: '14.8.3.5 Configurando o esvaziamento do pool de buffers',
								link: '/15-the-innodb-storage-engine/08-inno-d-b-configuration/03-inno-d-b-buffer-pool-configuration/05-configuring-buffer-pool-flushing.md',
							},
							{
								text: '14.8.3.6 Salvar e restaurar o estado do pool de buffers',
								link: '/15-the-innodb-storage-engine/08-inno-d-b-configuration/03-inno-d-b-buffer-pool-configuration/06-saving-and-restoring-the-buffer-pool-state.md',
							},
						],
						link: '/15-the-innodb-storage-engine/08-inno-d-b-configuration/03-inno-d-b-buffer-pool-configuration/index.md',
					},
					{
						text: '14.8.11 Configurando estatísticas do otimizador para InnoDB',
						collapsed: true,
						items: [
							{
								text: '14.8.11.1 Configurando parâmetros de estatísticas do otimizador persistente',
								link: '/15-the-innodb-storage-engine/08-inno-d-b-configuration/11-configuring-optimizer-statistics-for-inno-db/01-configuring-persistent-optimizer-statistics-parameters.md',
							},
							{
								text: '14.8.11.2 Configurando Parâmetros de Estatísticas do Otimizador Não Persistente',
								link: '/15-the-innodb-storage-engine/08-inno-d-b-configuration/11-configuring-optimizer-statistics-for-inno-db/02-configuring-non-persistent-optimizer-statistics-parameters.md',
							},
							{
								text: '14.8.11.3 Estimação da complexidade da Tabela ANALYZE para tabelas InnoDB',
								link: '/15-the-innodb-storage-engine/08-inno-d-b-configuration/11-configuring-optimizer-statistics-for-inno-db/03-estimating-a-n-a-l-y-z-e-t-a-b-l-e-complexity-for-inno-d-b-tables.md',
							},
						],
						link: '/15-the-innodb-storage-engine/08-inno-d-b-configuration/11-configuring-optimizer-statistics-for-inno-db/index.md',
					},
				],
				link: '/15-the-innodb-storage-engine/08-inno-d-b-configuration/index.md',
			},
			{
				text: '14.9 Compressão de Tabelas e Páginas do InnoDB',
				collapsed: true,
				items: [
					{
						text: '14.9.2 Compressão de Páginas do InnoDB',
						link: '/15-the-innodb-storage-engine/09-inno-d-b-table-and-page-compression/02-inno-d-b-page-compression.md',
					},
					{
						text: '14.9.1 Compressão de Tabelas InnoDB',
						collapsed: true,
						items: [
							{
								text: '14.9.1.1 Visão geral da compressão de tabelas',
								link: '/15-the-innodb-storage-engine/09-inno-d-b-table-and-page-compression/01-inno-d-b-table-compression/01-overview-of-table-compression.md',
							},
							{
								text: '14.9.1.2 Criando tabelas compactadas',
								link: '/15-the-innodb-storage-engine/09-inno-d-b-table-and-page-compression/01-inno-d-b-table-compression/02-creating-compressed-tables.md',
							},
							{
								text: '14.9.1.3 Ajuste da compressão para tabelas InnoDB',
								link: '/15-the-innodb-storage-engine/09-inno-d-b-table-and-page-compression/01-inno-d-b-table-compression/03-tuning-compression-for-inno-d-b-tables.md',
							},
							{
								text: '14.9.1.4 Monitoramento da Compressão de Tabelas InnoDB em Tempo Real',
								link: '/15-the-innodb-storage-engine/09-inno-d-b-table-and-page-compression/01-inno-d-b-table-compression/04-monitoring-inno-d-b-table-compression-at-runtime.md',
							},
							{
								text: '14.9.1.5 Como a compressão funciona para tabelas InnoDB',
								link: '/15-the-innodb-storage-engine/09-inno-d-b-table-and-page-compression/01-inno-d-b-table-compression/05-how-compression-works-for-inno-d-b-tables.md',
							},
							{
								text: '14.9.1.6 Compressão para cargas de trabalho OLTP',
								link: '/15-the-innodb-storage-engine/09-inno-d-b-table-and-page-compression/01-inno-d-b-table-compression/06-compression-for-o-l-t-p-workloads.md',
							},
							{
								text: '14.9.1.7 Avisos e erros de sintaxe de compressão de SQL',
								link: '/15-the-innodb-storage-engine/09-inno-d-b-table-and-page-compression/01-inno-d-b-table-compression/07-s-q-l-compression-syntax-warnings-and-errors.md',
							},
						],
						link: '/15-the-innodb-storage-engine/09-inno-d-b-table-and-page-compression/01-inno-d-b-table-compression/index.md',
					},
				],
				link: '/15-the-innodb-storage-engine/09-inno-d-b-table-and-page-compression/index.md',
			},
			{
				text: '14.10 Gerenciamento do formato de arquivo InnoDB',
				collapsed: true,
				items: [
					{
						text: '14.10.1 Habilitar formatos de arquivo',
						link: '/15-the-innodb-storage-engine/10-inno-d-b-file-format-management/01-enabling-file-formats.md',
					},
					{
						text: '14.10.3 Identificar o formato de arquivo em uso',
						link: '/15-the-innodb-storage-engine/10-inno-d-b-file-format-management/03-identifying-the-file-format-in-use.md',
					},
					{
						text: '14.10.4 Modificar o formato do arquivo',
						link: '/15-the-innodb-storage-engine/10-inno-d-b-file-format-management/04-modifying-the-file-format.md',
					},
					{
						text: '14.10.1 Verificar a compatibilidade com o formato de arquivo',
						collapsed: true,
						items: [
							{
								text: '14.10.2.1 Verificação de compatibilidade quando o InnoDB é iniciado',
								link: '/15-the-innodb-storage-engine/10-inno-d-b-file-format-management/02-verifying-file-format-compatibility/01-compatibility-check-when-inno-d-b-is-started.md',
							},
							{
								text: '14.10.2.2 Verificação de compatibilidade ao abrir uma tabela',
								link: '/15-the-innodb-storage-engine/10-inno-d-b-file-format-management/02-verifying-file-format-compatibility/02-compatibility-check-when-a-table-is-opened.md',
							},
						],
						link: '/15-the-innodb-storage-engine/10-inno-d-b-file-format-management/02-verifying-file-format-compatibility/index.md',
					},
				],
				link: '/15-the-innodb-storage-engine/10-inno-d-b-file-format-management/index.md',
			},
			{
				text: '14.12 Gerenciamento de I/O de disco e espaço de arquivo do InnoDB',
				collapsed: true,
				items: [
					{
						text: '14.12.1 Entrada/saída de disco InnoDB',
						link: '/15-the-innodb-storage-engine/12-inno-d-b-disk-i-o-and-file-space-management/01-inno-d-b-disk-io.md',
					},
					{
						text: '14.12.1 Gerenciamento de Espaço de Arquivo',
						link: '/15-the-innodb-storage-engine/12-inno-d-b-disk-i-o-and-file-space-management/02-file-space-management.md',
					},
					{
						text: '14.12.3 Pontos de verificação do InnoDB',
						link: '/15-the-innodb-storage-engine/12-inno-d-b-disk-i-o-and-file-space-management/03-inno-d-b-checkpoints.md',
					},
					{
						text: '14.12.4 Desfragmentação de uma tabela',
						link: '/15-the-innodb-storage-engine/12-inno-d-b-disk-i-o-and-file-space-management/04-defragmenting-a-table.md',
					},
					{
						text: '14.12.5 Recuperando Espaço em Disco com TRUNCATE TABLE',
						link: '/15-the-innodb-storage-engine/12-inno-d-b-disk-i-o-and-file-space-management/05-reclaiming-disk-space-with-t-r-u-n-c-a-t-e-table.md',
					},
				],
				link: '/15-the-innodb-storage-engine/12-inno-d-b-disk-i-o-and-file-space-management/index.md',
			},
			{
				text: '14.13 InnoDB e DDL Online',
				collapsed: true,
				items: [
					{
						text: '14.13.1 Operações de DDL online',
						link: '/15-the-innodb-storage-engine/13-inno-d-b-and-online-ddl/01-online-d-d-l-operations.md',
					},
					{
						text: '14.13.2 Desempenho e Concorrência de DDL Online',
						link: '/15-the-innodb-storage-engine/13-inno-d-b-and-online-ddl/02-online-d-d-l-performance-and-concurrency.md',
					},
					{
						text: '14.13.3 Requisitos de Espaço para DDL Online',
						link: '/15-the-innodb-storage-engine/13-inno-d-b-and-online-ddl/03-online-d-d-l-space-requirements.md',
					},
					{
						text: '14.13.4 Simplificando declarações DDL com DDL online',
						link: '/15-the-innodb-storage-engine/13-inno-d-b-and-online-ddl/04-simplifying-d-d-l-statements-with-online-ddl.md',
					},
					{
						text: '14.13.5 Condições de falha do DDL online',
						link: '/15-the-innodb-storage-engine/13-inno-d-b-and-online-ddl/05-online-d-d-l-failure-conditions.md',
					},
					{
						text: '14.13.6 Limitações do DDL online',
						link: '/15-the-innodb-storage-engine/13-inno-d-b-and-online-ddl/06-online-d-d-l-limitations.md',
					},
				],
				link: '/15-the-innodb-storage-engine/13-inno-d-b-and-online-ddl/index.md',
			},
			{
				text: '14.16 Tabelas do esquema de informações InnoDB',
				collapsed: true,
				items: [
					{
						text: '14.16.3 Tabelas do esquema de informações do InnoDB',
						link: '/15-the-innodb-storage-engine/16-inno-d-b-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-tables/03-inno-d-b-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-system-tables.md',
					},
					{
						text: '14.16.4 Tabelas de índice FULLTEXT do esquema de informações InnoDB',
						link: '/15-the-innodb-storage-engine/16-inno-d-b-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-tables/04-inno-d-b-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-f-u-l-l-t-e-x-t-index-tables.md',
					},
					{
						text: '14.16.5 Tabelas do Banco de Armazenamento do Banco de Dados do Schema de Informação InnoDB',
						link: '/15-the-innodb-storage-engine/16-inno-d-b-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-tables/05-inno-d-b-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-buffer-pool-tables.md',
					},
					{
						text: '14.16.6 Tabela de métricas do esquema de informações InnoDB',
						link: '/15-the-innodb-storage-engine/16-inno-d-b-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-tables/06-inno-d-b-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-metrics-table.md',
					},
					{
						text: '14.16.7 Tabela de informações da tabela temporária do esquema de informações do InnoDB',
						link: '/15-the-innodb-storage-engine/16-inno-d-b-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-tables/07-inno-d-b-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-temporary-table-info-table.md',
					},
					{
						text: '14.16.8 Recuperação dos metadados do espaço de tabela InnoDB a partir do INFORMATION_SCHEMA.FILES',
						link: '/15-the-innodb-storage-engine/16-inno-d-b-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-tables/08-retrieving-inno-d-b-tablespace-metadata-from-i-n-f-o-r-m-a-t-i-o-n-schema-files.md',
					},
					{
						text: '14.16.1 Tabelas do esquema de informações InnoDB sobre compressão',
						collapsed: true,
						items: [
							{
								text: '14.16.1.1 INNODB_CMP e INNODB_CMP_RESET',
								link: '/15-the-innodb-storage-engine/16-inno-d-b-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-tables/01-inno-d-b-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-tables-about-compression/01-i-n-n-o-d-b-c-m-p-and-i-n-n-o-d-b-c-m-p-reset.md',
							},
							{
								text: '14.16.1.2 INNODB_CMPMEM e INNODB_CMPMEM_RESET',
								link: '/15-the-innodb-storage-engine/16-inno-d-b-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-tables/01-inno-d-b-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-tables-about-compression/02-i-n-n-o-d-b-c-m-p-m-e-m-and-i-n-n-o-d-b-c-m-p-m-e-m-reset.md',
							},
							{
								text: '14.16.1.3 Usar as tabelas do esquema de informações de compressão',
								link: '/15-the-innodb-storage-engine/16-inno-d-b-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-tables/01-inno-d-b-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-tables-about-compression/03-using-the-compression-information-schema-tables.md',
							},
						],
						link: '/15-the-innodb-storage-engine/16-inno-d-b-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-tables/01-inno-d-b-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-tables-about-compression/index.md',
					},
					{
						text: '14.16.2 Informações de transação e bloqueio do esquema de informações InnoDB',
						collapsed: true,
						items: [
							{
								text: '14.16.2.1 Usando Informações de Transação e Bloqueio do InnoDB',
								link: '/15-the-innodb-storage-engine/16-inno-d-b-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-tables/02-inno-d-b-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-transaction-and-locking-information/01-using-inno-d-b-transaction-and-locking-information.md',
							},
							{
								text: '14.16.2.2 Informações sobre bloqueio e espera de bloqueio do InnoDB',
								link: '/15-the-innodb-storage-engine/16-inno-d-b-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-tables/02-inno-d-b-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-transaction-and-locking-information/02-inno-d-b-lock-and-lock-wait-information.md',
							},
							{
								text: '14.16.2.3 Persistência e Consistência das Informações de Transação e Bloqueio do InnoDB',
								link: '/15-the-innodb-storage-engine/16-inno-d-b-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-tables/02-inno-d-b-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-transaction-and-locking-information/03-persistence-and-consistency-of-inno-d-b-transaction-and-locking-information.md',
							},
						],
						link: '/15-the-innodb-storage-engine/16-inno-d-b-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-tables/02-inno-d-b-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-transaction-and-locking-information/index.md',
					},
				],
				link: '/15-the-innodb-storage-engine/16-inno-d-b-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-tables/index.md',
			},
			{
				text: '14.17 Integração InnoDB com o MySQL Performance Schema',
				collapsed: true,
				items: [
					{
						text: '14.17.1 Monitoramento do progresso da alteração de tabelas ALTER TABLE para tabelas InnoDB usando o Gerenciador de Desempenho',
						link: '/15-the-innodb-storage-engine/17-inno-d-b-integration-with-my-s-q-l-performance-schema/01-monitoring-a-l-t-e-r-t-a-b-l-e-progress-for-inno-d-b-tables-using-performance-schema.md',
					},
					{
						text: '14.17.2 Monitoramento das Esperas de Mutex InnoDB Usando o Schema de Desempenho',
						link: '/15-the-innodb-storage-engine/17-inno-d-b-integration-with-my-s-q-l-performance-schema/02-monitoring-inno-d-b-mutex-waits-using-performance-schema.md',
					},
				],
				link: '/15-the-innodb-storage-engine/17-inno-d-b-integration-with-my-s-q-l-performance-schema/index.md',
			},
			{
				text: '14.18 Monitores InnoDB',
				collapsed: true,
				items: [
					{
						text: '14.18.1 Tipos de Monitor InnoDB',
						link: '/15-the-innodb-storage-engine/18-inno-d-b-monitors/01-inno-d-b-monitor-types.md',
					},
					{
						text: '14.18.2 Habilitar monitores InnoDB',
						link: '/15-the-innodb-storage-engine/18-inno-d-b-monitors/02-enabling-inno-d-b-monitors.md',
					},
					{
						text: '14.18.3 Monitor padrão InnoDB e Monitor de bloqueio de saída',
						link: '/15-the-innodb-storage-engine/18-inno-d-b-monitors/03-inno-d-b-standard-monitor-and-lock-monitor-output.md',
					},
				],
				link: '/15-the-innodb-storage-engine/18-inno-d-b-monitors/index.md',
			},
			{
				text: '14.19. Backup e recuperação do InnoDB',
				collapsed: true,
				items: [
					{
						text: '14.19.1 Backup do InnoDB',
						link: '/15-the-innodb-storage-engine/19-inno-d-b-backup-and-recovery/01-inno-d-b-backup.md',
					},
					{
						text: '14.19.2 Recuperação do InnoDB',
						link: '/15-the-innodb-storage-engine/19-inno-d-b-backup-and-recovery/02-inno-d-b-recovery.md',
					},
				],
				link: '/15-the-innodb-storage-engine/19-inno-d-b-backup-and-recovery/index.md',
			},
			{
				text: '14.21 Plugin InnoDB memcached',
				collapsed: true,
				items: [
					{
						text: '14.21.1 Benefícios do Plugin memcached do InnoDB',
						link: '/15-the-innodb-storage-engine/21-inno-d-b-memcached-plugin/01-benefits-of-the-inno-d-b-memcached-plugin.md',
					},
					{
						text: '14.21.2 Arquitetura do memcached do InnoDB',
						link: '/15-the-innodb-storage-engine/21-inno-d-b-memcached-plugin/02-inno-d-b-memcached-architecture.md',
					},
					{
						text: '14.21.3 Configurando o Plugin InnoDB memcached',
						link: '/15-the-innodb-storage-engine/21-inno-d-b-memcached-plugin/03-setting-up-the-inno-d-b-memcached-plugin.md',
					},
					{
						text: '14.21.4 Considerações de segurança para o plugin InnoDB memcached',
						link: '/15-the-innodb-storage-engine/21-inno-d-b-memcached-plugin/04-security-considerations-for-the-inno-d-b-memcached-plugin.md',
					},
					{
						text: '14.21.6 O Plugin e a Replicação do memcached do InnoDB',
						link: '/15-the-innodb-storage-engine/21-inno-d-b-memcached-plugin/06-the-inno-d-b-memcached-plugin-and-replication.md',
					},
					{
						text: '14.21.7 Interiores do Plugin memcached do InnoDB',
						link: '/15-the-innodb-storage-engine/21-inno-d-b-memcached-plugin/07-inno-d-b-memcached-plugin-internals.md',
					},
					{
						text: '14.21.8 Solução de problemas do plugin InnoDB memcached',
						link: '/15-the-innodb-storage-engine/21-inno-d-b-memcached-plugin/08-troubleshooting-the-inno-d-b-memcached-plugin.md',
					},
					{
						text: '14.21.5 Escrever Aplicativos para o Plugin memcached do InnoDB',
						collapsed: true,
						items: [
							{
								text: '14.21.5.1 Adaptando um Schema Existente do MySQL para o Plugin memcached do InnoDB',
								link: '/15-the-innodb-storage-engine/21-inno-d-b-memcached-plugin/05-writing-applications-for-the-inno-d-b-memcached-plugin/01-adapting-an-existing-my-s-q-l-schema-for-the-inno-d-b-memcached-plugin.md',
							},
							{
								text: '14.21.5.2 Adaptando uma aplicação memcached para o plugin memcached do InnoDB',
								link: '/15-the-innodb-storage-engine/21-inno-d-b-memcached-plugin/05-writing-applications-for-the-inno-d-b-memcached-plugin/02-adapting-a-memcached-application-for-the-inno-d-b-memcached-plugin.md',
							},
							{
								text: '14.21.5.3 Ajuste do desempenho do plugin InnoDB memcached',
								link: '/15-the-innodb-storage-engine/21-inno-d-b-memcached-plugin/05-writing-applications-for-the-inno-d-b-memcached-plugin/03-tuning-inno-d-b-memcached-plugin-performance.md',
							},
							{
								text: '14.21.5.4 Controle do comportamento transacional do plugin memcached do InnoDB',
								link: '/15-the-innodb-storage-engine/21-inno-d-b-memcached-plugin/05-writing-applications-for-the-inno-d-b-memcached-plugin/04-controlling-transactional-behavior-of-the-inno-d-b-memcached-plugin.md',
							},
							{
								text: '14.21.5.5 Adaptando declarações DML para operações memcached',
								link: '/15-the-innodb-storage-engine/21-inno-d-b-memcached-plugin/05-writing-applications-for-the-inno-d-b-memcached-plugin/05-adapting-d-m-l-statements-to-memcached-operations.md',
							},
							{
								text: '14.21.5.6 Executando declarações DML e DDL na tabela subjacente InnoDB',
								link: '/15-the-innodb-storage-engine/21-inno-d-b-memcached-plugin/05-writing-applications-for-the-inno-d-b-memcached-plugin/06-performing-d-m-l-and-d-d-l-statements-on-the-underlying-inno-d-b-table.md',
							},
						],
						link: '/15-the-innodb-storage-engine/21-inno-d-b-memcached-plugin/05-writing-applications-for-the-inno-d-b-memcached-plugin/index.md',
					},
				],
				link: '/15-the-innodb-storage-engine/21-inno-d-b-memcached-plugin/index.md',
			},
			{
				text: '14.22 Solução de problemas do InnoDB',
				collapsed: true,
				items: [
					{
						text: '14.22.1 Solução de problemas com problemas de I/O do InnoDB',
						link: '/15-the-innodb-storage-engine/22-inno-d-b-troubleshooting/01-troubleshooting-inno-d-b-i-o-problems.md',
					},
					{
						text: '14.22.2 Forçar a recuperação do InnoDB',
						link: '/15-the-innodb-storage-engine/22-inno-d-b-troubleshooting/02-forcing-inno-d-b-recovery.md',
					},
					{
						text: '14.22.3 Solução de problemas nas operações do Dicionário de Dados InnoDB',
						link: '/15-the-innodb-storage-engine/22-inno-d-b-troubleshooting/03-troubleshooting-inno-d-b-data-dictionary-operations.md',
					},
					{
						text: '14.22.4 Gerenciamento de Erros do InnoDB',
						link: '/15-the-innodb-storage-engine/22-inno-d-b-troubleshooting/04-inno-d-b-error-handling.md',
					},
				],
				link: '/15-the-innodb-storage-engine/22-inno-d-b-troubleshooting/index.md',
			},
		],
		link: '/15-the-innodb-storage-engine/index.md',
	},
	{
		text: 'Capítulo 15 Motores de Armazenamento Alternativos',
		collapsed: true,
		items: [
			{
				text: '15.1 Configurando o Motor de Armazenamento',
				link: '/16-alternative-storage-engines/01-setting-the-storage-engine.md',
			},
			{
				text: '15.3 O Motor de Armazenamento de MEMORY',
				link: '/16-alternative-storage-engines/03-the-m-e-m-o-r-y-storage-engine.md',
			},
			{
				text: '15.5 O Motor de Armazenamento ARCHIVE',
				link: '/16-alternative-storage-engines/05-the-a-r-c-h-i-v-e-storage-engine.md',
			},
			{
				text: '15.6 O Motor de Armazenamento BLACKHOLE',
				link: '/16-alternative-storage-engines/06-the-b-l-a-c-k-h-o-l-e-storage-engine.md',
			},
			{
				text: '15.9 O Motor de Armazenamento EXAMPLE',
				link: '/16-alternative-storage-engines/09-the-e-x-a-m-p-l-e-storage-engine.md',
			},
			{
				text: '15.10 Outros motores de armazenamento',
				link: '/16-alternative-storage-engines/10-other-storage-engines.md',
			},
			{
				text: '15.2 O Motor de Armazenamento MyISAM',
				collapsed: true,
				items: [
					{
						text: '15.2.1 Opções de inicialização do MyISAM',
						link: '/16-alternative-storage-engines/02-the-my-i-s-a-m-storage-engine/01-my-i-s-a-m-startup-options.md',
					},
					{
						text: '15.2.2 Espaço necessário para as chaves',
						link: '/16-alternative-storage-engines/02-the-my-i-s-a-m-storage-engine/02-space-needed-for-keys.md',
					},
					{
						text: '15.2.3 Formas de armazenamento de tabelas MyISAM',
						collapsed: true,
						items: [
							{
								text: '15.2.3.1 Características de uma tabela estática (com comprimento fixo)',
								link: '/16-alternative-storage-engines/02-the-my-i-s-a-m-storage-engine/03-my-i-s-a-m-table-storage-formats/01-static-fixed-length-table-characteristics.md',
							},
							{
								text: '15.2.3.2 Características dinâmicas da tabela',
								link: '/16-alternative-storage-engines/02-the-my-i-s-a-m-storage-engine/03-my-i-s-a-m-table-storage-formats/02-dynamic-table-characteristics.md',
							},
							{
								text: '15.2.3.3 Características da Tabela Compressa',
								link: '/16-alternative-storage-engines/02-the-my-i-s-a-m-storage-engine/03-my-i-s-a-m-table-storage-formats/03-compressed-table-characteristics.md',
							},
						],
						link: '/16-alternative-storage-engines/02-the-my-i-s-a-m-storage-engine/03-my-i-s-a-m-table-storage-formats/index.md',
					},
					{
						text: '15.2.4 Problemas com tabelas MyISAM',
						collapsed: true,
						items: [
							{
								text: '15.2.4.1 Tabelas Corrompidas do MyISAM',
								link: '/16-alternative-storage-engines/02-the-my-i-s-a-m-storage-engine/04-my-i-s-a-m-table-problems/01-corrupted-my-i-s-a-m-tables.md',
							},
							{
								text: '15.2.4.2 Problemas decorrentes da não fechamento adequado das tabelas',
								link: '/16-alternative-storage-engines/02-the-my-i-s-a-m-storage-engine/04-my-i-s-a-m-table-problems/02-problems-from-tables-not-being-closed-properly.md',
							},
						],
						link: '/16-alternative-storage-engines/02-the-my-i-s-a-m-storage-engine/04-my-i-s-a-m-table-problems/index.md',
					},
				],
				link: '/16-alternative-storage-engines/02-the-my-i-s-a-m-storage-engine/index.md',
			},
			{
				text: '15.4 O Motor de Armazenamento CSV',
				collapsed: true,
				items: [
					{
						text: '15.4.1 Reparo e verificação de tabelas CSV',
						link: '/16-alternative-storage-engines/04-the-c-s-v-storage-engine/01-repairing-and-checking-c-s-v-tables.md',
					},
					{
						text: '15.4.2 Limitações do CSV',
						link: '/16-alternative-storage-engines/04-the-c-s-v-storage-engine/02-c-s-v-limitations.md',
					},
				],
				link: '/16-alternative-storage-engines/04-the-c-s-v-storage-engine/index.md',
			},
			{
				text: '15.7 O Motor de Armazenamento MERGE',
				collapsed: true,
				items: [
					{
						text: '15.7.1 Vantagens e desvantagens da tabela MERGE',
						link: '/16-alternative-storage-engines/07-the-m-e-r-g-e-storage-engine/01-m-e-r-g-e-table-advantages-and-disadvantages.md',
					},
					{
						text: '15.7.2 Problemas com a tabela MERGE',
						link: '/16-alternative-storage-engines/07-the-m-e-r-g-e-storage-engine/02-m-e-r-g-e-table-problems.md',
					},
				],
				link: '/16-alternative-storage-engines/07-the-m-e-r-g-e-storage-engine/index.md',
			},
			{
				text: '15.8 O Motor de Armazenamento FEDERATED',
				collapsed: true,
				items: [
					{
						text: '15.8.1 Visão geral do mecanismo de armazenamento FEDERATED',
						link: '/16-alternative-storage-engines/08-the-f-e-d-e-r-a-t-e-d-storage-engine/01-f-e-d-e-r-a-t-e-d-storage-engine-overview.md',
					},
					{
						text: '15.8.3 Motor de Armazenamento FEDERATED Notas e Dicas',
						link: '/16-alternative-storage-engines/08-the-f-e-d-e-r-a-t-e-d-storage-engine/03-f-e-d-e-r-a-t-e-d-storage-engine-notes-and-tips.md',
					},
					{
						text: '15.8.4 Recursos do Motor de Armazenamento FEDERATED',
						link: '/16-alternative-storage-engines/08-the-f-e-d-e-r-a-t-e-d-storage-engine/04-f-e-d-e-r-a-t-e-d-storage-engine-resources.md',
					},
					{
						text: '15.8.2 Como criar tabelas FEDERATED',
						collapsed: true,
						items: [
							{
								text: '15.8.2.1 Criando uma Tabela FEDERATED Usando a CONEXÃO',
								link: '/16-alternative-storage-engines/08-the-f-e-d-e-r-a-t-e-d-storage-engine/02-how-to-create-f-e-d-e-r-a-t-e-d-tables/01-creating-a-f-e-d-e-r-a-t-e-d-table-using-connection.md',
							},
							{
								text: '15.8.2.2 Criando uma Tabela FEDERATED Usando CREATE SERVER',
								link: '/16-alternative-storage-engines/08-the-f-e-d-e-r-a-t-e-d-storage-engine/02-how-to-create-f-e-d-e-r-a-t-e-d-tables/02-creating-a-f-e-d-e-r-a-t-e-d-table-using-c-r-e-a-t-e-server.md',
							},
						],
						link: '/16-alternative-storage-engines/08-the-f-e-d-e-r-a-t-e-d-storage-engine/02-how-to-create-f-e-d-e-r-a-t-e-d-tables/index.md',
					},
				],
				link: '/16-alternative-storage-engines/08-the-f-e-d-e-r-a-t-e-d-storage-engine/index.md',
			},
			{
				text: '15.11 Visão geral da arquitetura do mecanismo de armazenamento do MySQL',
				collapsed: true,
				items: [
					{
						text: '15.11.1 Arquitetura de Motor de Armazenamento Desmontável',
						link: '/16-alternative-storage-engines/11-overview-of-my-s-q-l-storage-engine-architecture/01-pluggable-storage-engine-architecture.md',
					},
					{
						text: '15.11.1 Camada do Servidor de Banco de Dados Comum',
						link: '/16-alternative-storage-engines/11-overview-of-my-s-q-l-storage-engine-architecture/02-the-common-database-server-layer.md',
					},
				],
				link: '/16-alternative-storage-engines/11-overview-of-my-s-q-l-storage-engine-architecture/index.md',
			},
		],
		link: '/16-alternative-storage-engines/index.md',
	},
	{
		text: 'Capítulo 16 Replicação',
		collapsed: true,
		items: [
			{
				text: '16.1 Configurando a Replicação',
				collapsed: true,
				items: [
					{
						text: '16.1.1 Configuração de Replicação Baseada na Posição do Arquivo de Registro Binário',
						link: '/17-replication/01-configuring-replication/01-binary-log-file-position-based-replication-configuration-overview.md',
					},
					{
						text: '16.1.2 Configuração da replicação com base na posição do arquivo de registro binário',
						collapsed: true,
						items: [
							{
								text: '16.1.2.1 Configuração da fonte de replicação',
								link: '/17-replication/01-configuring-replication/02-setting-up-binary-log-file-position-based-replication/01-setting-the-replication-source-configuration.md',
							},
							{
								text: '16.1.2.2 Criar um Usuário para Replicação',
								link: '/17-replication/01-configuring-replication/02-setting-up-binary-log-file-position-based-replication/02-creating-a-user-for-replication.md',
							},
							{
								text: '16.1.2.3. Obter as coordenadas do log binário da fonte de replicação',
								link: '/17-replication/01-configuring-replication/02-setting-up-binary-log-file-position-based-replication/03-obtaining-the-replication-source-s-binary-log-coordinates.md',
							},
							{
								text: '16.1.2.4 Escolhendo um Método para Instantâneos de Dados',
								link: '/17-replication/01-configuring-replication/02-setting-up-binary-log-file-position-based-replication/04-choosing-a-method-for-data-snapshots.md',
							},
							{
								text: '16.1.2.5 Configurando Replicas',
								link: '/17-replication/01-configuring-replication/02-setting-up-binary-log-file-position-based-replication/05-setting-up-replicas.md',
							},
							{
								text: '16.1.2.6 Adicionando réplicas a uma topologia de replicação',
								link: '/17-replication/01-configuring-replication/02-setting-up-binary-log-file-position-based-replication/06-adding-replicas-to-a-replication-topology.md',
							},
						],
						link: '/17-replication/01-configuring-replication/02-setting-up-binary-log-file-position-based-replication/index.md',
					},
					{
						text: '16.1.3 Replicação com Identificadores de Transação Global',
						collapsed: true,
						items: [
							{
								text: '16.1.3.1 Formato e Armazenamento do GTID',
								link: '/17-replication/01-configuring-replication/03-replication-with-global-transaction-identifiers/01-g-t-i-d-format-and-storage.md',
							},
							{
								text: '16.1.3.2 Ciclo de vida do GTID',
								link: '/17-replication/01-configuring-replication/03-replication-with-global-transaction-identifiers/02-g-t-i-d-life-cycle.md',
							},
							{
								text: '16.1.3.3 Autoposicionamento do GTID',
								link: '/17-replication/01-configuring-replication/03-replication-with-global-transaction-identifiers/03-g-t-i-d-auto-positioning.md',
							},
							{
								text: '16.1.3.4 Configurando a replicação usando GTIDs',
								link: '/17-replication/01-configuring-replication/03-replication-with-global-transaction-identifiers/04-setting-up-replication-using-gti-ds.md',
							},
							{
								text: '16.1.3.5 Uso de GTIDs para Failover e Scaleout',
								link: '/17-replication/01-configuring-replication/03-replication-with-global-transaction-identifiers/05-using-gti-ds-for-failover-and-scaleout.md',
							},
							{
								text: '16.1.3.6 Restrições à replicação com GTIDs',
								link: '/17-replication/01-configuring-replication/03-replication-with-global-transaction-identifiers/06-restrictions-on-replication-with-gti-ds.md',
							},
							{
								text: '16.1.3.7 Exemplos de funções armazenadas para manipular GTIDs',
								link: '/17-replication/01-configuring-replication/03-replication-with-global-transaction-identifiers/07-stored-function-examples-to-manipulate-gti-ds.md',
							},
						],
						link: '/17-replication/01-configuring-replication/03-replication-with-global-transaction-identifiers/index.md',
					},
					{
						text: '16.1.4 Mudando os modos de replicação em servidores online',
						collapsed: true,
						items: [
							{
								text: '16.1.4.1 Conceitos do Modo de Replicação',
								link: '/17-replication/01-configuring-replication/04-changing-replication-modes-on-online-servers/01-replication-mode-concepts.md',
							},
							{
								text: '16.1.4.2 Habilitar transações GTID online',
								link: '/17-replication/01-configuring-replication/04-changing-replication-modes-on-online-servers/02-enabling-g-t-i-d-transactions-online.md',
							},
							{
								text: '16.1.4.3 Desativar transações GTID online',
								link: '/17-replication/01-configuring-replication/04-changing-replication-modes-on-online-servers/03-disabling-g-t-i-d-transactions-online.md',
							},
							{
								text: '16.1.4.4 Verificar a replicação de transações anônimas',
								link: '/17-replication/01-configuring-replication/04-changing-replication-modes-on-online-servers/04-verifying-replication-of-anonymous-transactions.md',
							},
						],
						link: '/17-replication/01-configuring-replication/04-changing-replication-modes-on-online-servers/index.md',
					},
					{
						text: '16.1.5 Replicação de múltiplas fontes do MySQL',
						collapsed: true,
						items: [
							{
								text: '16.1.5.1 Configurando a Replicação de Múltiplas Fontes',
								link: '/17-replication/01-configuring-replication/05-my-s-q-l-multi-source-replication/01-configuring-multi-source-replication.md',
							},
							{
								text: '16.1.5.2 Configuração de uma Replicação de Múltiplas Fontes para Replicação Baseada em GTID',
								link: '/17-replication/01-configuring-replication/05-my-s-q-l-multi-source-replication/02-provisioning-a-multi-source-replica-for-gtid-based-replication.md',
							},
							{
								text: '16.1.5.3 Adicionando fontes baseadas em GTID a uma réplica de múltiplas fontes',
								link: '/17-replication/01-configuring-replication/05-my-s-q-l-multi-source-replication/03-adding-gtid-based-sources-to-a-multi-source-replica.md',
							},
							{
								text: '16.1.5.4 Adicionando uma Fonte de Registro Binário à Replica de Múltiplas Fontes',
								link: '/17-replication/01-configuring-replication/05-my-s-q-l-multi-source-replication/04-adding-a-binary-log-based-source-to-a-multi-source-replica.md',
							},
							{
								text: '16.1.5.5 Começando as Replicas de Múltiplos Fontes',
								link: '/17-replication/01-configuring-replication/05-my-s-q-l-multi-source-replication/05-starting-multi-source-replicas.md',
							},
							{
								text: '16.1.5.6 Parar as réplicas de múltiplas fontes',
								link: '/17-replication/01-configuring-replication/05-my-s-q-l-multi-source-replication/06-stopping-multi-source-replicas.md',
							},
							{
								text: '16.1.5.7 Redefinir réplicas de múltiplas fontes',
								link: '/17-replication/01-configuring-replication/05-my-s-q-l-multi-source-replication/07-resetting-multi-source-replicas.md',
							},
							{
								text: '16.1.5.8 Monitoramento da Replicação de Múltiplos Fontes',
								link: '/17-replication/01-configuring-replication/05-my-s-q-l-multi-source-replication/08-multi-source-replication-monitoring.md',
							},
						],
						link: '/17-replication/01-configuring-replication/05-my-s-q-l-multi-source-replication/index.md',
					},
					{
						text: '16.1.6 Opções e variáveis de replicação e registro binário',
						collapsed: true,
						items: [
							{
								text: '16.1.6.1 Opção de Registro Binário e de Replicação e Referência de Variáveis',
								link: '/17-replication/01-configuring-replication/06-replication-and-binary-logging-options-and-variables/01-replication-and-binary-logging-option-and-variable-reference.md',
							},
							{
								text: '16.1.6.2 Opções e variáveis de fonte de replicação',
								link: '/17-replication/01-configuring-replication/06-replication-and-binary-logging-options-and-variables/02-replication-source-options-and-variables.md',
							},
							{
								text: '16.1.6.3 Opções e variáveis do servidor de replicação',
								link: '/17-replication/01-configuring-replication/06-replication-and-binary-logging-options-and-variables/03-replica-server-options-and-variables.md',
							},
							{
								text: '16.1.6.4 Opções e variáveis de registro binário',
								link: '/17-replication/01-configuring-replication/06-replication-and-binary-logging-options-and-variables/04-binary-logging-options-and-variables.md',
							},
							{
								text: '16.1.6.5 Variáveis do Sistema de ID de Transação Global',
								link: '/17-replication/01-configuring-replication/06-replication-and-binary-logging-options-and-variables/05-global-transaction-i-d-system-variables.md',
							},
						],
						link: '/17-replication/01-configuring-replication/06-replication-and-binary-logging-options-and-variables/index.md',
					},
					{
						text: '16.1.7 Tarefas comuns de administração de replicação',
						collapsed: true,
						items: [
							{
								text: '16.1.7.1 Verificar o status da replicação',
								link: '/17-replication/01-configuring-replication/07-common-replication-administration-tasks/01-checking-replication-status.md',
							},
							{
								text: '16.1.7.2 Pausar a replicação na réplica',
								link: '/17-replication/01-configuring-replication/07-common-replication-administration-tasks/02-pausing-replication-on-the-replica.md',
							},
							{
								text: '16.1.7.3 Ignorar transações',
								link: '/17-replication/01-configuring-replication/07-common-replication-administration-tasks/03-skipping-transactions.md',
							},
						],
						link: '/17-replication/01-configuring-replication/07-common-replication-administration-tasks/index.md',
					},
				],
				link: '/17-replication/01-configuring-replication/index.md',
			},
			{
				text: '16.2 Implementação da Replicação',
				collapsed: true,
				items: [
					{
						text: '16.2.1 Formas de replicação',
						collapsed: true,
						items: [
							{
								text: '16.2.1.1 Vantagens e desvantagens da replicação baseada em declarações e baseada em linhas',
								link: '/17-replication/02-replication-implementation/01-replication-formats/01-advantages-and-disadvantages-of-statement-based-and-row-based-replication.md',
							},
							{
								text: '16.2.1.2 Uso do Registro e Replicação Baseado em Linhas',
								link: '/17-replication/02-replication-implementation/01-replication-formats/02-usage-of-row-based-logging-and-replication.md',
							},
							{
								text: '16.2.1.3 Determinação de declarações seguras e inseguras no registro binário',
								link: '/17-replication/02-replication-implementation/01-replication-formats/03-determination-of-safe-and-unsafe-statements-in-binary-logging.md',
							},
						],
						link: '/17-replication/02-replication-implementation/01-replication-formats/index.md',
					},
					{
						text: '16.2.2 Canais de replicação',
						collapsed: true,
						items: [
							{
								text: '16.2.2.1 Comandos para operações em um único canal',
								link: '/17-replication/02-replication-implementation/02-replication-channels/01-commands-for-operations-on-a-single-channel.md',
							},
							{
								text: '16.2.2.2. Compatibilidade com declarações de replicação anteriores',
								link: '/17-replication/02-replication-implementation/02-replication-channels/02-compatibility-with-previous-replication-statements.md',
							},
							{
								text: '16.2.2.3 Opções de inicialização e canais de replicação',
								link: '/17-replication/02-replication-implementation/02-replication-channels/03-startup-options-and-replication-channels.md',
							},
							{
								text: '16.2.2.4 Convenções de Nomenclatura de Canais de Replicação',
								link: '/17-replication/02-replication-implementation/02-replication-channels/04-replication-channel-naming-conventions.md',
							},
						],
						link: '/17-replication/02-replication-implementation/02-replication-channels/index.md',
					},
					{
						text: '16.2.3 Fios de replicação',
						collapsed: true,
						items: [
							{
								text: '16.2.3.1 Monitoramento das Threads Principais de Replicação',
								link: '/17-replication/02-replication-implementation/03-replication-threads/01-monitoring-replication-main-threads.md',
							},
							{
								text: '16.2.3.2 Monitoramento das Threads do Trabalhador do Aplicativo de Aplicação de Replicação',
								link: '/17-replication/02-replication-implementation/03-replication-threads/02-monitoring-replication-applier-worker-threads.md',
							},
						],
						link: '/17-replication/02-replication-implementation/03-replication-threads/index.md',
					},
					{
						text: '16.2.4 Repositórios de Log de Relé e Metadados de Replicação',
						collapsed: true,
						items: [
							{
								text: '16.2.4.1 O Log de Relé',
								link: '/17-replication/02-replication-implementation/04-relay-log-and-replication-metadata-repositories/01-the-relay-log.md',
							},
							{
								text: '16.2.4.2 Repositórios de metadados de replicação',
								link: '/17-replication/02-replication-implementation/04-relay-log-and-replication-metadata-repositories/02-replication-metadata-repositories.md',
							},
						],
						link: '/17-replication/02-replication-implementation/04-relay-log-and-replication-metadata-repositories/index.md',
					},
					{
						text: '16.2.5 Como os servidores avaliam as regras de filtragem de replicação',
						collapsed: true,
						items: [
							{
								text: '16.2.5.1 Avaliação das opções de replicação e registro binário em nível de banco de dados',
								link: '/17-replication/02-replication-implementation/05-how-servers-evaluate-replication-filtering-rules/01-evaluation-of-database-level-replication-and-binary-logging-options.md',
							},
							{
								text: '16.2.5.2 Avaliação das Opções de Replicação de Nível de Tabela',
								link: '/17-replication/02-replication-implementation/05-how-servers-evaluate-replication-filtering-rules/02-evaluation-of-table-level-replication-options.md',
							},
							{
								text: '16.2.5.3 Interações entre as opções de filtragem de replicação',
								link: '/17-replication/02-replication-implementation/05-how-servers-evaluate-replication-filtering-rules/03-interactions-between-replication-filtering-options.md',
							},
						],
						link: '/17-replication/02-replication-implementation/05-how-servers-evaluate-replication-filtering-rules/index.md',
					},
				],
				link: '/17-replication/02-replication-implementation/index.md',
			},
			{
				text: '16.3 Soluções de Replicação',
				collapsed: true,
				items: [
					{
						text: '16.3.2 Tratamento de um Parada Inesperada de uma Replicação',
						link: '/17-replication/03-replication-solutions/02-handling-an-unexpected-halt-of-a-replica.md',
					},
					{
						text: '16.3.3 Uso da replicação com diferentes motores de armazenamento de origem e réplica',
						link: '/17-replication/03-replication-solutions/03-using-replication-with-different-source-and-replica-storage-engines.md',
					},
					{
						text: '16.3.4 Usar a replicação para expansão em escala',
						link: '/17-replication/03-replication-solutions/04-using-replication-for-scale-out.md',
					},
					{
						text: '16.3.5 Replicação de diferentes bancos de dados em diferentes réplicas',
						link: '/17-replication/03-replication-solutions/05-replicating-different-databases-to-different-replicas.md',
					},
					{
						text: '16.3.6 Melhorando o desempenho da replicação',
						link: '/17-replication/03-replication-solutions/06-improving-replication-performance.md',
					},
					{
						text: '16.3.7 Alteração de fontes durante o failover',
						link: '/17-replication/03-replication-solutions/07-switching-sources-during-failover.md',
					},
					{
						text: '16.3.8 Configurando a replicação para usar conexões criptografadas',
						link: '/17-replication/03-replication-solutions/08-setting-up-replication-to-use-encrypted-connections.md',
					},
					{
						text: '16.3.10 Replicação atrasada',
						link: '/17-replication/03-replication-solutions/10-delayed-replication.md',
					},
					{
						text: '16.3.1 Uso da replicação para backups',
						collapsed: true,
						items: [
							{
								text: '16.3.1.1 Fazer backup de uma réplica usando mysqldump',
								link: '/17-replication/03-replication-solutions/01-using-replication-for-backups/01-backing-up-a-replica-using-mysqldump.md',
							},
							{
								text: '16.3.1.2 Fazer backup de dados brutos de uma réplica',
								link: '/17-replication/03-replication-solutions/01-using-replication-for-backups/02-backing-up-raw-data-from-a-replica.md',
							},
							{
								text: '16.3.1.3 Fazer backup de uma fonte ou réplica tornando-a apenas de leitura',
								link: '/17-replication/03-replication-solutions/01-using-replication-for-backups/03-backing-up-a-source-or-replica-by-making-it-read-only.md',
							},
						],
						link: '/17-replication/03-replication-solutions/01-using-replication-for-backups/index.md',
					},
					{
						text: '16.3.9 Replicação semiesincronizada',
						collapsed: true,
						items: [
							{
								text: '16.3.9.1 Interface Administrativa de Replicação Semisincronizada',
								link: '/17-replication/03-replication-solutions/09-semisynchronous-replication/01-semisynchronous-replication-administrative-interface.md',
							},
							{
								text: '16.3.9.2 Instalação e configuração da replicação semiesincronizada',
								link: '/17-replication/03-replication-solutions/09-semisynchronous-replication/02-semisynchronous-replication-installation-and-configuration.md',
							},
							{
								text: '16.3.9.3 Monitoramento da Replicação Semisincronizada',
								link: '/17-replication/03-replication-solutions/09-semisynchronous-replication/03-semisynchronous-replication-monitoring.md',
							},
						],
						link: '/17-replication/03-replication-solutions/09-semisynchronous-replication/index.md',
					},
				],
				link: '/17-replication/03-replication-solutions/index.md',
			},
			{
				text: '16.4 Notas e dicas de replicação',
				collapsed: true,
				items: [
					{
						text: '16.4.2 Compatibilidade de replicação entre versões do MySQL',
						link: '/17-replication/04-replication-notes-and-tips/02-replication-compatibility-between-my-s-q-l-versions.md',
					},
					{
						text: '16.4.3 Atualização de uma topologia de replicação',
						link: '/17-replication/04-replication-notes-and-tips/03-upgrading-a-replication-topology.md',
					},
					{
						text: '16.4.4 Solução de problemas de replicação',
						link: '/17-replication/04-replication-notes-and-tips/04-troubleshooting-replication.md',
					},
					{
						text: '16.4.5 Como relatar erros ou problemas de replicação',
						link: '/17-replication/04-replication-notes-and-tips/05-how-to-report-replication-bugs-or-problems.md',
					},
					{
						text: '16.4.1 Recursos e problemas de replicação',
						collapsed: true,
						items: [
							{
								text: '16.4.1.1 Replicação e AUTO_INCREMENT',
								link: '/17-replication/04-replication-notes-and-tips/01-replication-features-and-issues/01-replication-and-a-u-t-o-increment.md',
							},
							{
								text: '16.4.1.2 Replicação e tabelas BLACKHOLE',
								link: '/17-replication/04-replication-notes-and-tips/01-replication-features-and-issues/02-replication-and-b-l-a-c-k-h-o-l-e-tables.md',
							},
							{
								text: '16.4.1.3 Replicação e Conjuntos de Caracteres',
								link: '/17-replication/04-replication-notes-and-tips/01-replication-features-and-issues/03-replication-and-character-sets.md',
							},
							{
								text: '16.4.1.4 Replicação e CHECKSUM TABLE',
								link: '/17-replication/04-replication-notes-and-tips/01-replication-features-and-issues/04-replication-and-c-h-e-c-k-s-u-m-table.md',
							},
							{
								text: '16.4.1.5 Replicação de declarações CREATE ... IF NOT EXISTS',
								link: '/17-replication/04-replication-notes-and-tips/01-replication-features-and-issues/05-replication-of-c-r-e-a-t-e-i-f-n-o-t-e-x-i-s-t-s-statements.md',
							},
							{
								text: '16.4.1.6 Replicação de declarações CREATE TABLE ... SELECT',
								link: '/17-replication/04-replication-notes-and-tips/01-replication-features-and-issues/06-replication-of-c-r-e-a-t-e-t-a-b-l-e-s-e-l-e-c-t-statements.md',
							},
							{
								text: '16.4.1.7 Replicação de CREATE SERVER, ALTER SERVER e DROP SERVER',
								link: '/17-replication/04-replication-notes-and-tips/01-replication-features-and-issues/07-replication-of-c-r-e-a-t-e-server-a-l-t-e-r-server-and-d-r-o-p-server.md',
							},
							{
								text: '16.4.1.8 Replicação de CURRENT_USER()',
								link: '/17-replication/04-replication-notes-and-tips/01-replication-features-and-issues/08-replication-of-c-u-r-r-e-n-t-user.md',
							},
							{
								text: '16.4.1.9 Replicação de declarações DROP ... IF EXISTS',
								link: '/17-replication/04-replication-notes-and-tips/01-replication-features-and-issues/09-replication-of-d-r-o-p-i-f-e-x-i-s-t-s-statements.md',
							},
							{
								text: '16.4.1.10 Replicação com definições de tabela diferentes na fonte e na réplica',
								link: '/17-replication/04-replication-notes-and-tips/01-replication-features-and-issues/10-replication-with-differing-table-definitions-on-source-and-replica.md',
							},
							{
								text: '16.4.1.11 Opções de tabela de replicação e diretório',
								link: '/17-replication/04-replication-notes-and-tips/01-replication-features-and-issues/11-replication-and-d-i-r-e-c-t-o-r-y-table-options.md',
							},
							{
								text: '16.4.1.12 Replicação e valores de ponto flutuante',
								link: '/17-replication/04-replication-notes-and-tips/01-replication-features-and-issues/12-replication-and-floating-point-values.md',
							},
							{
								text: '16.4.1.13 Suporte à replicação e segundos fracionários',
								link: '/17-replication/04-replication-notes-and-tips/01-replication-features-and-issues/13-replication-and-fractional-seconds-support.md',
							},
							{
								text: '16.4.1.14 Replicação e FLUSH',
								link: '/17-replication/04-replication-notes-and-tips/01-replication-features-and-issues/14-replication-and-flush.md',
							},
							{
								text: '16.4.1.15 Replicação e funções do sistema',
								link: '/17-replication/04-replication-notes-and-tips/01-replication-features-and-issues/15-replication-and-system-functions.md',
							},
							{
								text: '16.4.1.16 Replicação de recursos solicitados',
								link: '/17-replication/04-replication-notes-and-tips/01-replication-features-and-issues/16-replication-of-invoked-features.md',
							},
							{
								text: '16.4.1.17 Replicação e LIMITE',
								link: '/17-replication/04-replication-notes-and-tips/01-replication-features-and-issues/17-replication-and-limit.md',
							},
							{
								text: '16.4.1.18 Replicação e LOAD DATA',
								link: '/17-replication/04-replication-notes-and-tips/01-replication-features-and-issues/18-replication-and-l-o-a-d-data.md',
							},
							{
								text: '16.4.1.19 Replicação e max_allowed_packet',
								link: '/17-replication/04-replication-notes-and-tips/01-replication-features-and-issues/19-replication-and-max-allowed-packet.md',
							},
							{
								text: '16.4.1.20 Replicação e tabelas de MEMORY',
								link: '/17-replication/04-replication-notes-and-tips/01-replication-features-and-issues/20-replication-and-m-e-m-o-r-y-tables.md',
							},
							{
								text: '16.4.1.21 Replicação do banco de dados do sistema mysql',
								link: '/17-replication/04-replication-notes-and-tips/01-replication-features-and-issues/21-replication-of-the-mysql-system-database.md',
							},
							{
								text: '16.4.1.22 Replicação e o otimizador de consultas',
								link: '/17-replication/04-replication-notes-and-tips/01-replication-features-and-issues/22-replication-and-the-query-optimizer.md',
							},
							{
								text: '16.4.1.23 Replicação e Partição',
								link: '/17-replication/04-replication-notes-and-tips/01-replication-features-and-issues/23-replication-and-partitioning.md',
							},
							{
								text: '16.4.1.24 Replicação e REPARAR TÁBLIA',
								link: '/17-replication/04-replication-notes-and-tips/01-replication-features-and-issues/24-replication-and-r-e-p-a-i-r-table.md',
							},
							{
								text: '16.4.1.25 Replicação e Palavras Reservadas',
								link: '/17-replication/04-replication-notes-and-tips/01-replication-features-and-issues/25-replication-and-reserved-words.md',
							},
							{
								text: '16.4.1.26 Replicação e interrupções de fontes ou réplicas',
								link: '/17-replication/04-replication-notes-and-tips/01-replication-features-and-issues/26-replication-and-source-or-replica-shutdowns.md',
							},
							{
								text: '16.4.1.27 Erros de replicação durante a replicação',
								link: '/17-replication/04-replication-notes-and-tips/01-replication-features-and-issues/27-replica-errors-during-replication.md',
							},
							{
								text: '16.4.1.28 Modo de replicação e servidor SQL',
								link: '/17-replication/04-replication-notes-and-tips/01-replication-features-and-issues/28-replication-and-server-s-q-l-mode.md',
							},
							{
								text: '16.4.1.29 Replicação e tabelas temporárias',
								link: '/17-replication/04-replication-notes-and-tips/01-replication-features-and-issues/29-replication-and-temporary-tables.md',
							},
							{
								text: '16.4.1.30 Tentativas de replicação e tempos de espera',
								link: '/17-replication/04-replication-notes-and-tips/01-replication-features-and-issues/30-replication-retries-and-timeouts.md',
							},
							{
								text: '16.4.1.31 Replicação e Fuso Horários',
								link: '/17-replication/04-replication-notes-and-tips/01-replication-features-and-issues/31-replication-and-time-zones.md',
							},
							{
								text: '16.4.1.32 Inconsistências na Replicação e Transações',
								link: '/17-replication/04-replication-notes-and-tips/01-replication-features-and-issues/32-replication-and-transaction-inconsistencies.md',
							},
							{
								text: '16.4.1.33 Replicação e Transações',
								link: '/17-replication/04-replication-notes-and-tips/01-replication-features-and-issues/33-replication-and-transactions.md',
							},
							{
								text: '16.4.1.34 Replicação e gatilhos',
								link: '/17-replication/04-replication-notes-and-tips/01-replication-features-and-issues/34-replication-and-triggers.md',
							},
							{
								text: '16.4.1.35 Replicação e TRUNCATE TABLE',
								link: '/17-replication/04-replication-notes-and-tips/01-replication-features-and-issues/35-replication-and-t-r-u-n-c-a-t-e-table.md',
							},
							{
								text: '16.4.1.36 Replicação e comprimento do nome do usuário',
								link: '/17-replication/04-replication-notes-and-tips/01-replication-features-and-issues/36-replication-and-user-name-length.md',
							},
							{
								text: '16.4.1.37 Replicação e variáveis',
								link: '/17-replication/04-replication-notes-and-tips/01-replication-features-and-issues/37-replication-and-variables.md',
							},
							{
								text: '16.4.1.38 Replicação e visualizações',
								link: '/17-replication/04-replication-notes-and-tips/01-replication-features-and-issues/38-replication-and-views.md',
							},
						],
						link: '/17-replication/04-replication-notes-and-tips/01-replication-features-and-issues/index.md',
					},
				],
				link: '/17-replication/04-replication-notes-and-tips/index.md',
			},
		],
		link: '/17-replication/index.md',
	},
	{
		text: 'Capítulo 17 Replicação em Grupo',
		collapsed: true,
		items: [
			{
				text: '17.8 Perguntas Frequentes',
				link: '/18-group-replication/08-frequently-asked-questions.md',
			},
			{
				text: '17.1 Contexto da Replicação em Grupo',
				collapsed: true,
				items: [
					{
						text: '17.1.1 Tecnologias de Replicação',
						collapsed: true,
						items: [
							{
								text: '17.1.1.1 Replicação primária-secundária',
								link: '/18-group-replication/01-group-replication-background/01-replication-technologies/01-primary-secondary-replication.md',
							},
							{
								text: '17.1.1.2 Replicação em grupo',
								link: '/18-group-replication/01-group-replication-background/01-replication-technologies/02-group-replication.md',
							},
						],
						link: '/18-group-replication/01-group-replication-background/01-replication-technologies/index.md',
					},
					{
						text: '17.1.2 Casos de uso de replicação em grupo',
						collapsed: true,
						items: [
							{
								text: '17.1.2.1 Exemplos de cenários de casos de uso',
								link: '/18-group-replication/01-group-replication-background/02-group-replication-use-cases/01-examples-of-use-case-scenarios.md',
							},
						],
						link: '/18-group-replication/01-group-replication-background/02-group-replication-use-cases/index.md',
					},
					{
						text: '17.1.3 Detalhes da Replicação em Grupo',
						collapsed: true,
						items: [
							{
								text: '17.1.3.1 Associação ao grupo',
								link: '/18-group-replication/01-group-replication-background/03-group-replication-details/01-group-membership.md',
							},
							{
								text: '17.1.3.2 Detecção de falhas',
								link: '/18-group-replication/01-group-replication-background/03-group-replication-details/02-failure-detection.md',
							},
							{
								text: '17.1.3.3 Tolerância a falhas',
								link: '/18-group-replication/01-group-replication-background/03-group-replication-details/03-fault-tolerance.md',
							},
						],
						link: '/18-group-replication/01-group-replication-background/03-group-replication-details/index.md',
					},
				],
				link: '/18-group-replication/01-group-replication-background/index.md',
			},
			{
				text: '17.2 Começando',
				collapsed: true,
				items: [
					{
						text: '17.2.2 Implantação da Replicação em Grupo Localmente',
						link: '/18-group-replication/02-getting-started/02-deploying-group-replication-locally.md',
					},
					{
						text: '17.2.1 Implantação da Replicação em Grupo no Modo de Primordial Único',
						collapsed: true,
						items: [
							{
								text: '17.2.1.1. Implantação de Instâncias para Replicação em Grupo',
								link: '/18-group-replication/02-getting-started/01-deploying-group-replication-in-single-primary-mode/01-deploying-instances-for-group-replication.md',
							},
							{
								text: '17.2.1.2 Configurando uma Instância para Replicação em Grupo',
								link: '/18-group-replication/02-getting-started/01-deploying-group-replication-in-single-primary-mode/02-configuring-an-instance-for-group-replication.md',
							},
							{
								text: '17.2.1.3 Credenciais do Usuário',
								link: '/18-group-replication/02-getting-started/01-deploying-group-replication-in-single-primary-mode/03-user-credentials.md',
							},
							{
								text: '17.2.1.4 Lançamento da Replicação em Grupo',
								link: '/18-group-replication/02-getting-started/01-deploying-group-replication-in-single-primary-mode/04-launching-group-replication.md',
							},
							{
								text: '17.2.1.5 Autofinanciamento do Grupo',
								link: '/18-group-replication/02-getting-started/01-deploying-group-replication-in-single-primary-mode/05-bootstrapping-the-group.md',
							},
							{
								text: '17.2.1.6 Adicionar instâncias ao grupo',
								link: '/18-group-replication/02-getting-started/01-deploying-group-replication-in-single-primary-mode/06-adding-instances-to-the-group.md',
							},
						],
						link: '/18-group-replication/02-getting-started/01-deploying-group-replication-in-single-primary-mode/index.md',
					},
				],
				link: '/18-group-replication/02-getting-started/index.md',
			},
			{
				text: '17.3 Requisitos e Limitações',
				collapsed: true,
				items: [
					{
						text: '17.3.1 Requisitos de Replicação em Grupo',
						link: '/18-group-replication/03-requirements-and-limitations/01-group-replication-requirements.md',
					},
					{
						text: '17.3.2 Limitações da Replicação em Grupo',
						link: '/18-group-replication/03-requirements-and-limitations/02-group-replication-limitations.md',
					},
				],
				link: '/18-group-replication/03-requirements-and-limitations/index.md',
			},
			{
				text: '17.4 Replicação do Grupo de Monitoramento',
				collapsed: true,
				items: [
					{
						text: '17.4.1 Estados do servidor de replicação em grupo',
						link: '/18-group-replication/04-monitoring-group-replication/01-group-replication-server-states.md',
					},
					{
						text: '17.4.2 A tabela replication_group_members',
						link: '/18-group-replication/04-monitoring-group-replication/02-the-replication-group-members-table.md',
					},
					{
						text: '17.4.3 A tabela replication_group_member_stats',
						link: '/18-group-replication/04-monitoring-group-replication/03-the-replication-group-member-stats-table.md',
					},
				],
				link: '/18-group-replication/04-monitoring-group-replication/index.md',
			},
			{
				text: '17.5 Operações de Replicação em Grupo',
				collapsed: true,
				items: [
					{
						text: '17.5.2 Recuperação de sintonização',
						link: '/18-group-replication/05-group-replication-operations/02-tuning-recovery.md',
					},
					{
						text: '17.5.3 Partição de rede',
						link: '/18-group-replication/05-group-replication-operations/03-network-partitioning.md',
					},
					{
						text: '17.5.4 Reiniciar um grupo',
						link: '/18-group-replication/05-group-replication-operations/04-restarting-a-group.md',
					},
					{
						text: '17.5.5 Usando o MySQL Enterprise Backup com a Replicação por Grupo',
						link: '/18-group-replication/05-group-replication-operations/05-using-my-s-q-l-enterprise-backup-with-group-replication.md',
					},
					{
						text: '17.5.1 Implantação no modo Multi-Primary ou Single-Primary',
						collapsed: true,
						items: [
							{
								text: '17.5.1.1 Modo de Primordial Único',
								link: '/18-group-replication/05-group-replication-operations/01-deploying-in-multi-primary-or-single-primary-mode/01-single-primary-mode.md',
							},
							{
								text: '17.5.1.2 Modo Multi-Primario',
								link: '/18-group-replication/05-group-replication-operations/01-deploying-in-multi-primary-or-single-primary-mode/02-multi-primary-mode.md',
							},
							{
								text: '17.5.1.3 Encontrar o Primário',
								link: '/18-group-replication/05-group-replication-operations/01-deploying-in-multi-primary-or-single-primary-mode/03-finding-the-primary.md',
							},
						],
						link: '/18-group-replication/05-group-replication-operations/01-deploying-in-multi-primary-or-single-primary-mode/index.md',
					},
				],
				link: '/18-group-replication/05-group-replication-operations/index.md',
			},
			{
				text: '17.6 Segurança da Replicação em Grupo',
				collapsed: true,
				items: [
					{
						text: '17.6.1 Permitir a lista de endereços IP de replicação em grupo',
						link: '/18-group-replication/06-group-replication-security/01-group-replication-i-p-address-allowlisting.md',
					},
					{
						text: '17.6.2 Suporte à Replicação em Grupo com Secure Socket Layer (SSL)',
						link: '/18-group-replication/06-group-replication-security/02-group-replication-secure-socket-layer-ssl-support.md',
					},
					{
						text: '17.6.3 Replicação em grupo e redes privadas virtuais (VPNs)',
						link: '/18-group-replication/06-group-replication-security/03-group-replication-and-virtual-private-networks-vp-ns.md',
					},
				],
				link: '/18-group-replication/06-group-replication-security/index.md',
			},
			{
				text: '17.7 Variáveis de Replicação em Grupo',
				collapsed: true,
				items: [
					{
						text: '17.7.1 Variáveis do Sistema de Replicação em Grupo',
						link: '/18-group-replication/07-group-replication-variables/01-group-replication-system-variables.md',
					},
					{
						text: '17.7.2 Variáveis de Status de Replicação em Grupo',
						link: '/18-group-replication/07-group-replication-variables/02-group-replication-status-variables.md',
					},
				],
				link: '/18-group-replication/07-group-replication-variables/index.md',
			},
			{
				text: '17.9 Detalhes técnicos da replicação em grupo',
				collapsed: true,
				items: [
					{
						text: '17.9.1 Arquitetura do Plugin de Replicação em Grupo',
						link: '/18-group-replication/09-group-replication-technical-details/01-group-replication-plugin-architecture.md',
					},
					{
						text: '17.9.2 O Grupo',
						link: '/18-group-replication/09-group-replication-technical-details/02-the-group.md',
					},
					{
						text: '17.9.3 Declarações de manipulação de dados',
						link: '/18-group-replication/09-group-replication-technical-details/03-data-manipulation-statements.md',
					},
					{
						text: '17.9.4 Declarações de Definição de Dados',
						link: '/18-group-replication/09-group-replication-technical-details/04-data-definition-statements.md',
					},
					{
						text: '17.9.6 Observabilidade',
						link: '/18-group-replication/09-group-replication-technical-details/06-observability.md',
					},
					{
						text: '17.9.5 Recuperação Distribuída',
						collapsed: true,
						items: [
							{
								text: '17.9.5.1 Princípios básicos de recuperação distribuída',
								link: '/18-group-replication/09-group-replication-technical-details/05-distributed-recovery/01-distributed-recovery-basics.md',
							},
							{
								text: '17.9.5.2 Recuperação a partir de um ponto no tempo',
								link: '/18-group-replication/09-group-replication-technical-details/05-distributed-recovery/02-recovering-from-a-point-in-time.md',
							},
							{
								text: '17.9.5.3 Ver alterações',
								link: '/18-group-replication/09-group-replication-technical-details/05-distributed-recovery/03-view-changes.md',
							},
							{
								text: '17.9.5.4 Recomendações de uso e limitações da recuperação distribuída',
								link: '/18-group-replication/09-group-replication-technical-details/05-distributed-recovery/04-usage-advice-and-limitations-of-distributed-recovery.md',
							},
						],
						link: '/18-group-replication/09-group-replication-technical-details/05-distributed-recovery/index.md',
					},
					{
						text: '17.9.7 Desempenho da Replicação em Grupo',
						collapsed: true,
						items: [
							{
								text: '17.9.7.1 Ajuste fino do tópico de comunicação do grupo',
								link: '/18-group-replication/09-group-replication-technical-details/07-group-replication-performance/01-fine-tuning-the-group-communication-thread.md',
							},
							{
								text: '17.9.7.2 Compressão de Mensagens',
								link: '/18-group-replication/09-group-replication-technical-details/07-group-replication-performance/02-message-compression.md',
							},
							{
								text: '17.9.7.3 Controle de fluxo',
								link: '/18-group-replication/09-group-replication-technical-details/07-group-replication-performance/03-flow-control.md',
							},
						],
						link: '/18-group-replication/09-group-replication-technical-details/07-group-replication-performance/index.md',
					},
				],
				link: '/18-group-replication/09-group-replication-technical-details/index.md',
			},
		],
		link: '/18-group-replication/index.md',
	},
  	{
		text: 'Capítulo 18 MySQL Shell',
		link: '/19-mysql-shell.md',
	},
	{
		text: 'Capítulo 19 Usando o MySQL como uma Armazenadora de Documentos',
		collapsed: true,
		items: [
			{
				text: '19.1 Conceitos-chave',
				link: '/20-using-mysql-as-a-document-store/01-key-concepts.md',
			},
			{
				text: '19.3 Guia de início rápido: MySQL para Visual Studio',
				link: '/20-using-mysql-as-a-document-store/03-quick-start-guide-my-s-q-l-for-visual-studio.md',
			},
			{
				text: '19.2 Configurando o MySQL como uma Armazenadora de Documentos',
				collapsed: true,
				items: [
					{
						text: '19.2.2 Começando o MySQL Shell',
						link: '/20-using-mysql-as-a-document-store/02-setting-up-my-s-q-l-as-a-document-store/02-starting-my-s-q-l-shell.md',
					},
					{
						text: '19.2.1 Instalar o MySQL Shell',
						collapsed: true,
						items: [
							{
								text: '19.2.1.1 Instalar o MySQL Shell no Microsoft Windows',
								link: '/20-using-mysql-as-a-document-store/02-setting-up-my-s-q-l-as-a-document-store/01-installing-my-s-q-l-shell/01-installing-my-s-q-l-shell-on-microsoft-windows.md',
							},
							{
								text: '19.2.1.2 Instalar o MySQL Shell no Linux',
								link: '/20-using-mysql-as-a-document-store/02-setting-up-my-s-q-l-as-a-document-store/01-installing-my-s-q-l-shell/02-installing-my-s-q-l-shell-on-linux.md',
							},
							{
								text: '19.2.1.3 Instalar o MySQL Shell no macOS',
								link: '/20-using-mysql-as-a-document-store/02-setting-up-my-s-q-l-as-a-document-store/01-installing-my-s-q-l-shell/03-installing-my-s-q-l-shell-on-mac-os.md',
							},
						],
						link: '/20-using-mysql-as-a-document-store/02-setting-up-my-s-q-l-as-a-document-store/01-installing-my-s-q-l-shell/index.md',
					},
				],
				link: '/20-using-mysql-as-a-document-store/02-setting-up-my-s-q-l-as-a-document-store/index.md',
			},
			{
				text: '19.4 X Plugin',
				collapsed: true,
				items: [
					{
						text: '19.4.1 Uso de conexões criptografadas com o plugin X',
						link: '/20-using-mysql-as-a-document-store/04-x-plugin/01-using-encrypted-connections-with-x-plugin.md',
					},
					{
						text: '19.4.3 Monitoramento X Plugin',
						link: '/20-using-mysql-as-a-document-store/04-x-plugin/03-monitoring-x-plugin.md',
					},
					{
						text: '19.4.2 Opções e variáveis do plugin X',
						collapsed: true,
						items: [
							{
								text: '19.4.2.1 Opção de Plugin e Referência de Variável',
								link: '/20-using-mysql-as-a-document-store/04-x-plugin/02-x-plugin-options-and-variables/01-x-plugin-option-and-variable-reference.md',
							},
							{
								text: '19.4.2.2 Opções do Plugin e Variáveis do Sistema',
								link: '/20-using-mysql-as-a-document-store/04-x-plugin/02-x-plugin-options-and-variables/02-x-plugin-options-and-system-variables.md',
							},
							{
								text: '19.4.2.3 Variáveis de Status do Plugin X',
								link: '/20-using-mysql-as-a-document-store/04-x-plugin/02-x-plugin-options-and-variables/03-x-plugin-status-variables.md',
							},
						],
						link: '/20-using-mysql-as-a-document-store/04-x-plugin/02-x-plugin-options-and-variables/index.md',
					},
				],
				link: '/20-using-mysql-as-a-document-store/04-x-plugin/index.md',
			},
		],
		link: '/20-using-mysql-as-a-document-store/index.md',
	},
  	{
		text: 'Capítulo 20: Cluster InnoDB',
		link: '/21-innodb-cluster.md',
	},
	{
		text: 'Capítulo 21 MySQL NDB Cluster 7.5 e NDB Cluster 7.6',
		collapsed: true,
		items: [
			{
				text: '21.1 Informações Gerais',
				link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/01-general-information.md',
			},
			{
				text: '21.8 Notas de lançamento do cluster do NDB',
				link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/08-n-d-b-cluster-release-notes.md',
			},
			{
				text: '21.2 Visão geral do cluster do BND',
				collapsed: true,
				items: [
					{
						text: '21.2.1 Conceitos centrais do Núcleo do Cluster NDB',
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/02-n-d-b-cluster-overview/01-n-d-b-cluster-core-concepts.md',
					},
					{
						text: '21.2.2 Nodos do clúster do BND, Grupos de nós, Replicas de fragmentos e Partições',
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/02-n-d-b-cluster-overview/02-n-d-b-cluster-nodes-node-groups-fragment-replicas-and-partitions.md',
					},
					{
						text: '21.2.3 Requisitos de hardware, software e redes do cluster NDB',
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/02-n-d-b-cluster-overview/03-n-d-b-cluster-hardware-software-and-networking-requirements.md',
					},
					{
						text: '21.2.4 O que há de novo no MySQL NDB Cluster',
						collapsed: true,
						items: [
							{
								text: '21.2.4.1 O que há de novo no NDB Cluster 7.5',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/02-n-d-b-cluster-overview/04-what-is-new-in-my-s-q-l-n-d-b-cluster/01-what-is-new-in-n-d-b-cluster-7-5.md',
							},
							{
								text: '21.2.4.2 O que há de novo no NDB Cluster 7.6',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/02-n-d-b-cluster-overview/04-what-is-new-in-my-s-q-l-n-d-b-cluster/02-what-is-new-in-n-d-b-cluster-7-6.md',
							},
						],
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/02-n-d-b-cluster-overview/04-what-is-new-in-my-s-q-l-n-d-b-cluster/index.md',
					},
					{
						text: '21.2.5 NDB: Opções, variáveis e parâmetros adicionados, descontinuados e removidos',
						collapsed: true,
						items: [
							{
								text: '21.2.5.1 Opções, variáveis e parâmetros adicionados, descontinuados ou removidos no NDB 7.5',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/02-n-d-b-cluster-overview/05-n-d-b-added-deprecated-and-removed-options-variables-and-parameters/01-options-variables-and-parameters-added-deprecated-or-removed-in-ndb-7-5.md',
							},
							{
								text: '21.2.5.2 Opções, variáveis e parâmetros adicionados, descontinuados ou removidos no NDB 7.6',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/02-n-d-b-cluster-overview/05-n-d-b-added-deprecated-and-removed-options-variables-and-parameters/02-options-variables-and-parameters-added-deprecated-or-removed-in-ndb-7-6.md',
							},
						],
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/02-n-d-b-cluster-overview/05-n-d-b-added-deprecated-and-removed-options-variables-and-parameters/index.md',
					},
					{
						text: '21.2.6 MySQL Server Usando InnoDB Comparado com NDB Cluster',
						collapsed: true,
						items: [
							{
								text: '21.2.6.1 Diferenças entre os motores de armazenamento NDB e InnoDB',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/02-n-d-b-cluster-overview/06-my-s-q-l-server-using-inno-d-b-compared-with-n-d-b-cluster/01-differences-between-the-n-d-b-and-inno-d-b-storage-engines.md',
							},
							{
								text: '21.2.6.2 Cargas de trabalho NDB e InnoDB',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/02-n-d-b-cluster-overview/06-my-s-q-l-server-using-inno-d-b-compared-with-n-d-b-cluster/02-n-d-b-and-inno-d-b-workloads.md',
							},
							{
								text: '21.2.6.3 Resumo do uso de recursos do NDB e do InnoDB',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/02-n-d-b-cluster-overview/06-my-s-q-l-server-using-inno-d-b-compared-with-n-d-b-cluster/03-n-d-b-and-inno-d-b-feature-usage-summary.md',
							},
						],
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/02-n-d-b-cluster-overview/06-my-s-q-l-server-using-inno-d-b-compared-with-n-d-b-cluster/index.md',
					},
					{
						text: '21.2.7 Limitações conhecidas do NDB Cluster',
						collapsed: true,
						items: [
							{
								text: '21.2.7.1 Não conformidade com a sintaxe SQL no NDB Cluster',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/02-n-d-b-cluster-overview/07-known-limitations-of-n-d-b-cluster/01-noncompliance-with-s-q-l-syntax-in-n-d-b-cluster.md',
							},
							{
								text: '21.2.7.2 Limitações e diferenças do cluster NDB em relação às limitações do MySQL padrão',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/02-n-d-b-cluster-overview/07-known-limitations-of-n-d-b-cluster/02-limits-and-differences-of-n-d-b-cluster-from-standard-my-s-q-l-limits.md',
							},
							{
								text: '21.2.7.3 Limitações relacionadas ao processamento de transações no NDB Cluster',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/02-n-d-b-cluster-overview/07-known-limitations-of-n-d-b-cluster/03-limits-relating-to-transaction-handling-in-n-d-b-cluster.md',
							},
							{
								text: '21.2.7.4 Gerenciamento de Erros do Agrupamento NDB',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/02-n-d-b-cluster-overview/07-known-limitations-of-n-d-b-cluster/04-n-d-b-cluster-error-handling.md',
							},
							{
								text: '21.2.7.5 Limites associados a objetos de banco de dados no NDB Cluster',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/02-n-d-b-cluster-overview/07-known-limitations-of-n-d-b-cluster/05-limits-associated-with-database-objects-in-n-d-b-cluster.md',
							},
							{
								text: '21.2.7.6 Recursos não suportados ou ausentes no NDB Cluster',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/02-n-d-b-cluster-overview/07-known-limitations-of-n-d-b-cluster/06-unsupported-or-missing-features-in-n-d-b-cluster.md',
							},
							{
								text: '21.2.7.7 Limitações relacionadas ao desempenho no cluster NDB',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/02-n-d-b-cluster-overview/07-known-limitations-of-n-d-b-cluster/07-limitations-relating-to-performance-in-n-d-b-cluster.md',
							},
							{
								text: '21.2.7.8 Questões exclusivas do cluster NDB',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/02-n-d-b-cluster-overview/07-known-limitations-of-n-d-b-cluster/08-issues-exclusive-to-n-d-b-cluster.md',
							},
							{
								text: '21.2.7.9 Limitações relacionadas ao armazenamento de dados do disco do cluster NDB',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/02-n-d-b-cluster-overview/07-known-limitations-of-n-d-b-cluster/09-limitations-relating-to-n-d-b-cluster-disk-data-storage.md',
							},
							{
								text: '21.2.7.10 Limitações relacionadas a múltiplos nós do cluster NDB',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/02-n-d-b-cluster-overview/07-known-limitations-of-n-d-b-cluster/10-limitations-relating-to-multiple-n-d-b-cluster-nodes.md',
							},
						],
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/02-n-d-b-cluster-overview/07-known-limitations-of-n-d-b-cluster/index.md',
					},
				],
				link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/02-n-d-b-cluster-overview/index.md',
			},
			{
				text: '21.3 Instalação do Cluster NDB',
				collapsed: true,
				items: [
					{
						text: '21.3.3 Configuração Inicial do NDB Cluster',
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/03-n-d-b-cluster-installation/03-initial-configuration-of-n-d-b-cluster.md',
					},
					{
						text: '21.3.4 Inicialização inicial do NDB Cluster',
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/03-n-d-b-cluster-installation/04-initial-startup-of-n-d-b-cluster.md',
					},
					{
						text: '21.3.5 Exemplo de cluster do NDB com tabelas e dados',
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/03-n-d-b-cluster-installation/05-n-d-b-cluster-example-with-tables-and-data.md',
					},
					{
						text: '21.3.6 Desligamento e Reinício Seguro do NDB Cluster',
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/03-n-d-b-cluster-installation/06-safe-shutdown-and-restart-of-n-d-b-cluster.md',
					},
					{
						text: '21.3.8 O instalador automático do NDB Cluster (NDB 7.5) (já não é suportado)',
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/03-n-d-b-cluster-installation/08-the-n-d-b-cluster-auto-installer-n-d-b-7-5-n-o-l-o-n-g-e-r-supported.md',
					},
					{
						text: '21.3.9 O instalador automático do NDB Cluster (já não é suportado)',
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/03-n-d-b-cluster-installation/09-the-n-d-b-cluster-auto-installer-n-o-l-o-n-g-e-r-supported.md',
					},
					{
						text: '21.3.1 Instalação do NDB Cluster no Linux',
						collapsed: true,
						items: [
							{
								text: '21.3.1.1 Instalar uma versão binária de um cluster NDB no Linux',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/03-n-d-b-cluster-installation/01-installation-of-n-d-b-cluster-on-linux/01-installing-an-n-d-b-cluster-binary-release-on-linux.md',
							},
							{
								text: '21.3.1.2 Instalar o NDB Cluster a partir do RPM',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/03-n-d-b-cluster-installation/01-installation-of-n-d-b-cluster-on-linux/02-installing-n-d-b-cluster-from-rpm.md',
							},
							{
								text: '21.3.1.3 Instalação do NDB Cluster usando arquivos .deb',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/03-n-d-b-cluster-installation/01-installation-of-n-d-b-cluster-on-linux/03-installing-n-d-b-cluster-using-deb-files.md',
							},
							{
								text: '21.3.1.4 Construindo um cluster NDB Cluster a partir do código-fonte no Linux',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/03-n-d-b-cluster-installation/01-installation-of-n-d-b-cluster-on-linux/04-building-n-d-b-cluster-from-source-on-linux.md',
							},
						],
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/03-n-d-b-cluster-installation/01-installation-of-n-d-b-cluster-on-linux/index.md',
					},
					{
						text: '21.3.2 Instalação do NDB Cluster no Windows',
						collapsed: true,
						items: [
							{
								text: '21.3.2.1 Instalação do NDB Cluster no Windows a partir de uma versão binária',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/03-n-d-b-cluster-installation/02-installing-n-d-b-cluster-on-windows/01-installing-n-d-b-cluster-on-windows-from-a-binary-release.md',
							},
							{
								text: '21.3.2.2 Compilar e instalar o NDB Cluster a partir da fonte no Windows',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/03-n-d-b-cluster-installation/02-installing-n-d-b-cluster-on-windows/02-compiling-and-installing-n-d-b-cluster-from-source-on-windows.md',
							},
							{
								text: '21.3.2.3 Inicialização inicial do NDB Cluster no Windows',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/03-n-d-b-cluster-installation/02-installing-n-d-b-cluster-on-windows/03-initial-startup-of-n-d-b-cluster-on-windows.md',
							},
							{
								text: '21.3.2.4 Instalar os processos do NDB Cluster como serviços do Windows',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/03-n-d-b-cluster-installation/02-installing-n-d-b-cluster-on-windows/04-installing-n-d-b-cluster-processes-as-windows-services.md',
							},
						],
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/03-n-d-b-cluster-installation/02-installing-n-d-b-cluster-on-windows/index.md',
					},
					{
						text: '21.3.7 Atualização e Downgrade do NDB Cluster',
						collapsed: true,
						items: [
							{
								text: '21.3.7.1 Atualização e Downgrade do NDB 7.5',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/03-n-d-b-cluster-installation/07-upgrading-and-downgrading-n-d-b-cluster/01-upgrading-and-downgrading-n-d-b-7-5.md',
							},
							{
								text: '21.3.7.2 Atualização e Downgrade do NDB 7.6',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/03-n-d-b-cluster-installation/07-upgrading-and-downgrading-n-d-b-cluster/02-upgrading-and-downgrading-n-d-b-7-6.md',
							},
						],
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/03-n-d-b-cluster-installation/07-upgrading-and-downgrading-n-d-b-cluster/index.md',
					},
				],
				link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/03-n-d-b-cluster-installation/index.md',
			},
			{
				text: '21.4 Configuração do NDB Cluster',
				collapsed: true,
				items: [
					{
						text: '21.4.1 Configuração rápida do teste do cluster NDB',
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/04-configuration-of-n-d-b-cluster/01-quick-test-setup-of-n-d-b-cluster.md',
					},
					{
						text: '21.4.4 Uso de interconexões de alta velocidade com o NDB Cluster',
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/04-configuration-of-n-d-b-cluster/04-using-high-speed-interconnects-with-n-d-b-cluster.md',
					},
					{
						text: '21.4.2 Visão geral dos parâmetros, opções e variáveis de configuração do cluster do NDB',
						collapsed: true,
						items: [
							{
								text: '21.4.2.1 Parâmetros de configuração do nó de dados do cluster NDB',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/04-configuration-of-n-d-b-cluster/02-overview-of-n-d-b-cluster-configuration-parameters-options-and-variables/01-n-d-b-cluster-data-node-configuration-parameters.md',
							},
							{
								text: '21.4.2.2 Parâmetros de configuração do nó de gerenciamento de cluster do NDB',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/04-configuration-of-n-d-b-cluster/02-overview-of-n-d-b-cluster-configuration-parameters-options-and-variables/02-n-d-b-cluster-management-node-configuration-parameters.md',
							},
							{
								text: '21.4.2.3 Parâmetros de configuração do nó SQL do cluster NDB e do nó API',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/04-configuration-of-n-d-b-cluster/02-overview-of-n-d-b-cluster-configuration-parameters-options-and-variables/03-n-d-b-cluster-s-q-l-node-and-a-p-i-node-configuration-parameters.md',
							},
							{
								text: '21.4.2.4 Outros parâmetros de configuração do cluster do NDB',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/04-configuration-of-n-d-b-cluster/02-overview-of-n-d-b-cluster-configuration-parameters-options-and-variables/04-other-n-d-b-cluster-configuration-parameters.md',
							},
							{
								text: '21.4.2.5 Referência de opção e variável do cluster NDB mysqld',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/04-configuration-of-n-d-b-cluster/02-overview-of-n-d-b-cluster-configuration-parameters-options-and-variables/05-n-d-b-cluster-mysqld-option-and-variable-reference.md',
							},
						],
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/04-configuration-of-n-d-b-cluster/02-overview-of-n-d-b-cluster-configuration-parameters-options-and-variables/index.md',
					},
					{
						text: '21.4.3 Arquivos de configuração do cluster do NDB',
						collapsed: true,
						items: [
							{
								text: '21.4.3.1 Configuração do Clúster NDB: Exemplo Básico',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/04-configuration-of-n-d-b-cluster/03-n-d-b-cluster-configuration-files/01-n-d-b-cluster-configuration-basic-example.md',
							},
							{
								text: '21.4.3.2 Configuração inicial recomendada para o cluster NDB',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/04-configuration-of-n-d-b-cluster/03-n-d-b-cluster-configuration-files/02-recommended-starting-configuration-for-n-d-b-cluster.md',
							},
							{
								text: '21.4.3.3 Strings de conexão do cluster NDB',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/04-configuration-of-n-d-b-cluster/03-n-d-b-cluster-configuration-files/03-n-d-b-cluster-connection-strings.md',
							},
							{
								text: '21.4.3.4 Definindo Computadores em um Clúster NDB',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/04-configuration-of-n-d-b-cluster/03-n-d-b-cluster-configuration-files/04-defining-computers-in-an-n-d-b-cluster.md',
							},
							{
								text: '21.4.3.5 Definindo um servidor de gerenciamento de cluster do NDB',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/04-configuration-of-n-d-b-cluster/03-n-d-b-cluster-configuration-files/05-defining-an-n-d-b-cluster-management-server.md',
							},
							{
								text: '21.4.3.6 Definindo nós de dados do cluster NDB',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/04-configuration-of-n-d-b-cluster/03-n-d-b-cluster-configuration-files/06-defining-n-d-b-cluster-data-nodes.md',
							},
							{
								text: '21.4.3.7 Definindo nós SQL e outros nós de API em um cluster NDB',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/04-configuration-of-n-d-b-cluster/03-n-d-b-cluster-configuration-files/07-defining-s-q-l-and-other-a-p-i-nodes-in-an-n-d-b-cluster.md',
							},
							{
								text: '21.4.3.8 Definindo o Sistema',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/04-configuration-of-n-d-b-cluster/03-n-d-b-cluster-configuration-files/08-defining-the-system.md',
							},
							{
								text: '21.4.3.9 Opções e variáveis do servidor MySQL para o NDB Cluster',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/04-configuration-of-n-d-b-cluster/03-n-d-b-cluster-configuration-files/09-my-s-q-l-server-options-and-variables-for-n-d-b-cluster.md',
							},
							{
								text: '21.4.3.10 Conexões de cluster NDB TCP/IP',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/04-configuration-of-n-d-b-cluster/03-n-d-b-cluster-configuration-files/10-n-d-b-cluster-t-c-p-i-p-connections.md',
							},
							{
								text: '21.4.3.11 Conexões de cluster NDB TCP/IP usando conexões diretas',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/04-configuration-of-n-d-b-cluster/03-n-d-b-cluster-configuration-files/11-n-d-b-cluster-t-c-p-i-p-connections-using-direct-connections.md',
							},
							{
								text: '21.4.3.12 Conexões de Memória Compartilhada do NDB Cluster',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/04-configuration-of-n-d-b-cluster/03-n-d-b-cluster-configuration-files/12-n-d-b-cluster-shared-memory-connections.md',
							},
							{
								text: '21.4.3.13 Configurando parâmetros do buffer de envio do NDB Cluster',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/04-configuration-of-n-d-b-cluster/03-n-d-b-cluster-configuration-files/13-configuring-n-d-b-cluster-send-buffer-parameters.md',
							},
						],
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/04-configuration-of-n-d-b-cluster/03-n-d-b-cluster-configuration-files/index.md',
					},
				],
				link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/04-configuration-of-n-d-b-cluster/index.md',
			},
			{
				text: '21.5 Programas de Agrupamento do BND',
				collapsed: true,
				items: [
					{
						text: '21.5.1 ndbd — O daemon do nó de dados do clúster NDB',
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/05-n-d-b-cluster-programs/01-ndbd-the-n-d-b-cluster-data-node-daemon.md',
					},
					{
						text: '21.5.2 ndbinfo_select_all — Selecionar de tabelas ndbinfo',
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/05-n-d-b-cluster-programs/02-ndbinfo-select-all-select-from-ndbinfo-tables.md',
					},
					{
						text: '21.5.3 ndbmtd — O daemon do nó de dados do cluster NDB (multi-threaded)',
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/05-n-d-b-cluster-programs/03-ndbmtd-the-n-d-b-cluster-data-node-daemon-multi-threaded.md',
					},
					{
						text: '21.5.4 ndb_mgmd — O daemon do servidor de gerenciamento de cluster NDB',
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/05-n-d-b-cluster-programs/04-ndb-mgmd-the-n-d-b-cluster-management-server-daemon.md',
					},
					{
						text: '21.5.5 ndb_mgm — O cliente de gerenciamento de cluster NDB',
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/05-n-d-b-cluster-programs/05-ndb-mgm-the-n-d-b-cluster-management-client.md',
					},
					{
						text: '21.5.6 ndb_blob_tool — Verificar e reparar colunas BLOB e TEXT de tabelas de NDB Cluster',
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/05-n-d-b-cluster-programs/06-ndb-blob-tool-check-and-repair-b-l-o-b-and-t-e-x-t-columns-of-n-d-b-cluster-tables.md',
					},
					{
						text: '21.5.7 ndb_config — Extrair informações de configuração do cluster NDB',
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/05-n-d-b-cluster-programs/07-ndb-config-extract-n-d-b-cluster-configuration-information.md',
					},
					{
						text: '21.5.8 ndb_cpcd — Automatizar testes para o desenvolvimento do NDB',
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/05-n-d-b-cluster-programs/08-ndb-cpcd-automate-testing-for-n-d-b-development.md',
					},
					{
						text: '21.5.9 ndb_delete_all — Excluir todas as linhas de uma tabela NDB',
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/05-n-d-b-cluster-programs/09-ndb-delete-all-delete-all-rows-from-an-n-d-b-table.md',
					},
					{
						text: '21.5.10 ndb_desc — Descreva as tabelas NDB',
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/05-n-d-b-cluster-programs/10-ndb-desc-describe-n-d-b-tables.md',
					},
					{
						text: '21.5.11 ndb_drop_index — Remover índice de uma tabela NDB',
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/05-n-d-b-cluster-programs/11-ndb-drop-index-drop-index-from-an-n-d-b-table.md',
					},
					{
						text: '21.5.12 ndb_drop_table — Remover uma tabela NDB',
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/05-n-d-b-cluster-programs/12-ndb-drop-table-drop-an-n-d-b-table.md',
					},
					{
						text: '21.5.13 ndb_error_reporter — Ferramenta de Relatório de Erros do NDB',
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/05-n-d-b-cluster-programs/13-ndb-error-reporter-n-d-b-error-reporting-utility.md',
					},
					{
						text: '21.5.14 ndb_import — Importar dados CSV no NDB',
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/05-n-d-b-cluster-programs/14-ndb-import-import-c-s-v-data-into-ndb.md',
					},
					{
						text: '21.5.15 ndb_index_stat — Ferramenta de estatísticas do índice NDB',
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/05-n-d-b-cluster-programs/15-ndb-index-stat-n-d-b-index-statistics-utility.md',
					},
					{
						text: '21.5.16 ndb_move_data — Ferramenta de cópia de dados do NDB',
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/05-n-d-b-cluster-programs/16-ndb-move-data-n-d-b-data-copy-utility.md',
					},
					{
						text: '21.5.17 ndb_perror — Obter informações da mensagem de erro do NDB',
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/05-n-d-b-cluster-programs/17-ndb-perror-obtain-n-d-b-error-message-information.md',
					},
					{
						text: '21.5.18 ndb_print_backup_file — Imprimir o conteúdo do arquivo de backup do NDB',
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/05-n-d-b-cluster-programs/18-ndb-print-backup-file-print-n-d-b-backup-file-contents.md',
					},
					{
						text: '21.5.19 ndb_print_file — Imprimir o conteúdo do arquivo de dados do disco NDB',
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/05-n-d-b-cluster-programs/19-ndb-print-file-print-n-d-b-disk-data-file-contents.md',
					},
					{
						text: '21.5.20 ndb_print_frag_file — Imprimir o conteúdo do arquivo de lista de fragmentos do NDB',
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/05-n-d-b-cluster-programs/20-ndb-print-frag-file-print-n-d-b-fragment-list-file-contents.md',
					},
					{
						text: '21.5.21 ndb_print_schema_file — Imprimir o conteúdo do arquivo de esquema do NDB',
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/05-n-d-b-cluster-programs/21-ndb-print-schema-file-print-n-d-b-schema-file-contents.md',
					},
					{
						text: '21.5.22 ndb_print_sys_file — Imprimir o conteúdo do arquivo do sistema NDB',
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/05-n-d-b-cluster-programs/22-ndb-print-sys-file-print-n-d-b-system-file-contents.md',
					},
					{
						text: '21.5.23 ndb_redo_log_reader — Verificar e imprimir o conteúdo do log de refazer do cluster',
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/05-n-d-b-cluster-programs/23-ndb-redo-log-reader-check-and-print-content-of-cluster-redo-log.md',
					},
					{
						text: '21.5.25 ndb_select_all — Imprimir linhas de uma tabela NDB',
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/05-n-d-b-cluster-programs/25-ndb-select-all-print-rows-from-an-n-d-b-table.md',
					},
					{
						text: '21.5.26 ndb_select_count — Imprimir contagem de linhas para tabelas NDB',
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/05-n-d-b-cluster-programs/26-ndb-select-count-print-row-counts-for-n-d-b-tables.md',
					},
					{
						text: '21.5.27 ndb_show_tables — Exibir a lista de tabelas NDB',
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/05-n-d-b-cluster-programs/27-ndb-show-tables-display-list-of-n-d-b-tables.md',
					},
					{
						text: '21.5.28 ndb_size.pl — Estimator de Requisitos de Tamanho do NDBCLUSTER',
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/05-n-d-b-cluster-programs/28-ndb-size-pl-n-d-b-c-l-u-s-t-e-r-size-requirement-estimator.md',
					},
					{
						text: '21.5.29 ndb_top — Visualizar informações de uso da CPU para os threads do NDB',
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/05-n-d-b-cluster-programs/29-ndb-top-view-c-p-u-usage-information-for-n-d-b-threads.md',
					},
					{
						text: '21.5.30 ndb_waiter — Aguarde o NDB Cluster atingir um status específico',
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/05-n-d-b-cluster-programs/30-ndb-waiter-wait-for-n-d-b-cluster-to-reach-a-given-status.md',
					},
					{
						text: '21.5.24 ndb_restore — Restaurar um backup de um cluster NDB',
						collapsed: true,
						items: [
							{
								text: '21.5.24.1 Restaurando um backup do NDB para uma versão diferente do cluster NDB',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/05-n-d-b-cluster-programs/24-ndb-restore-restore-an-n-d-b-cluster-backup/01-restoring-an-n-d-b-backup-to-a-different-version-of-n-d-b-cluster.md',
							},
							{
								text: '21.5.24.2 Restauração para um número diferente de nós de dados',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/05-n-d-b-cluster-programs/24-ndb-restore-restore-an-n-d-b-cluster-backup/02-restoring-to-a-different-number-of-data-nodes.md',
							},
						],
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/05-n-d-b-cluster-programs/24-ndb-restore-restore-an-n-d-b-cluster-backup/index.md',
					},
				],
				link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/05-n-d-b-cluster-programs/index.md',
			},
			{
				text: '21.6 Gerenciamento do NDB Cluster',
				collapsed: true,
				items: [
					{
						text: '21.6.1 Comandos no Cliente de Gerenciamento do NDB Cluster',
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/01-commands-in-the-n-d-b-cluster-management-client.md',
					},
					{
						text: '21.6.4 Resumo das fases de início do cluster do NDB',
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/04-summary-of-n-d-b-cluster-start-phases.md',
					},
					{
						text: '21.6.5 Realizar um Reinício Rotativo de um Clúster NDB',
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/05-performing-a-rolling-restart-of-an-n-d-b-cluster.md',
					},
					{
						text: '21.6.6 Modo de usuário único do cluster NDB',
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/06-n-d-b-cluster-single-user-mode.md',
					},
					{
						text: '21.6.9 Importando dados no MySQL Cluster',
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/09-importing-data-into-my-s-q-l-cluster.md',
					},
					{
						text: '21.6.10 Uso do MySQL Server para o NDB Cluster',
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/10-my-s-q-l-server-usage-for-n-d-b-cluster.md',
					},
					{
						text: '21.6.12 Operações online com ALTER TABLE no NDB Cluster',
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/12-online-operations-with-a-l-t-e-r-t-a-b-l-e-in-n-d-b-cluster.md',
					},
					{
						text: '21.6.13 Privilégios distribuídos usando tabelas de concessão compartilhadas',
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/13-distributed-privileges-using-shared-grant-tables.md',
					},
					{
						text: '21.6.14 Contadores e variáveis de estatísticas da API do BND',
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/14-n-d-b-a-p-i-statistics-counters-and-variables.md',
					},
					{
						text: '21.6.16 INFORMATION_SCHEMA Tabelas para NDB Cluster',
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/16-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-tables-for-n-d-b-cluster.md',
					},
					{
						text: '21.6.17 Referência Rápida: Declarações SQL do NDB Cluster',
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/17-quick-reference-n-d-b-cluster-s-q-l-statements.md',
					},
					{
						text: '21.6.2 Mensagens de log do cluster do NDB',
						collapsed: true,
						items: [
							{
								text: '21.6.2.1 NDB Cluster: Mensagens no Log do Cluster',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/02-n-d-b-cluster-log-messages/01-n-d-b-cluster-messages-in-the-cluster-log.md',
							},
							{
								text: '21.6.2.2 Mensagens de inicialização do log do cluster do NDB',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/02-n-d-b-cluster-log-messages/02-n-d-b-cluster-log-startup-messages.md',
							},
							{
								text: '21.6.2.3 Relatório de Buffer de Eventos no Log do Clúster',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/02-n-d-b-cluster-log-messages/03-event-buffer-reporting-in-the-cluster-log.md',
							},
							{
								text: '21.6.2.4 NDB Cluster: Erros do Transportador NDB',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/02-n-d-b-cluster-log-messages/04-n-d-b-cluster-n-d-b-transporter-errors.md',
							},
						],
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/02-n-d-b-cluster-log-messages/index.md',
					},
					{
						text: '21.6.3 Relatórios de eventos gerados no NDB Cluster',
						collapsed: true,
						items: [
							{
								text: '21.6.3.1 Comandos de Gerenciamento de Registro de Agrupamento NDB',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/03-event-reports-generated-in-n-d-b-cluster/01-n-d-b-cluster-logging-management-commands.md',
							},
							{
								text: '21.6.3.2 Eventos de registro do cluster NDB',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/03-event-reports-generated-in-n-d-b-cluster/02-n-d-b-cluster-log-events.md',
							},
							{
								text: '21.6.3.3 Usar estatísticas do CLUSTERLOG no cliente de gerenciamento de clusters NDB',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/03-event-reports-generated-in-n-d-b-cluster/03-using-c-l-u-s-t-e-r-l-o-g-s-t-a-t-i-s-t-i-c-s-in-the-n-d-b-cluster-management-client.md',
							},
						],
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/03-event-reports-generated-in-n-d-b-cluster/index.md',
					},
					{
						text: '21.6.7 Adicionando nós de dados do NDB Cluster Online',
						collapsed: true,
						items: [
							{
								text: '21.6.7.1 Adicionando nós de dados do NDB Cluster Online: Problemas gerais',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/07-adding-n-d-b-cluster-data-nodes-online/01-adding-n-d-b-cluster-data-nodes-online-general-issues.md',
							},
							{
								text: '21.6.7.2 Adicionando nós de dados do NDB Cluster Online: procedimento básico',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/07-adding-n-d-b-cluster-data-nodes-online/02-adding-n-d-b-cluster-data-nodes-online-basic-procedure.md',
							},
							{
								text: '21.6.7.3 Adicionando nós de dados do NDB Cluster Online: exemplo detalhado',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/07-adding-n-d-b-cluster-data-nodes-online/03-adding-n-d-b-cluster-data-nodes-online-detailed-example.md',
							},
						],
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/07-adding-n-d-b-cluster-data-nodes-online/index.md',
					},
					{
						text: '21.6.8 Backup online do NDB Cluster',
						collapsed: true,
						items: [
							{
								text: '21.6.8.1 Conceitos de backup de clusters do NDB',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/08-online-backup-of-n-d-b-cluster/01-n-d-b-cluster-backup-concepts.md',
							},
							{
								text: '21.6.8.2 Usar o cliente de gerenciamento de cluster do NDB para criar um backup',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/08-online-backup-of-n-d-b-cluster/02-using-the-n-d-b-cluster-management-client-to-create-a-backup.md',
							},
							{
								text: '21.6.8.3 Configuração para backups do NDB Cluster',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/08-online-backup-of-n-d-b-cluster/03-configuration-for-n-d-b-cluster-backups.md',
							},
							{
								text: '21.6.8.4 Solução de problemas de backup do cluster NDB',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/08-online-backup-of-n-d-b-cluster/04-n-d-b-cluster-backup-troubleshooting.md',
							},
						],
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/08-online-backup-of-n-d-b-cluster/index.md',
					},
					{
						text: '21.6.11 Tabelas de dados de disco do cluster NDB',
						collapsed: true,
						items: [
							{
								text: '21.6.11.1 Objetos de dados de disco do cluster NDB',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/11-n-d-b-cluster-disk-data-tables/01-n-d-b-cluster-disk-data-objects.md',
							},
							{
								text: '21.6.11.2 Uso de Links Simbólicos com Objetos de Dados de Disco',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/11-n-d-b-cluster-disk-data-tables/02-using-symbolic-links-with-disk-data-objects.md',
							},
							{
								text: '21.6.11.3 Requisitos de Armazenamento de Dados de Disco do NDB Cluster',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/11-n-d-b-cluster-disk-data-tables/03-n-d-b-cluster-disk-data-storage-requirements.md',
							},
						],
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/11-n-d-b-cluster-disk-data-tables/index.md',
					},
					{
						text: '21.6.15 ndbinfo: A Base de Dados de Informação do NDB Cluster',
						collapsed: true,
						items: [
							{
								text: '21.6.15.1 Tabela ndbinfo arbitrator_validity_detail',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/15-ndbinfo-the-n-d-b-cluster-information-database/01-the-ndbinfo-arbitrator-validity-detail-table.md',
							},
							{
								text: '21.6.15.2 A tabela ndbinfo arbitrator_validity_summary',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/15-ndbinfo-the-n-d-b-cluster-information-database/02-the-ndbinfo-arbitrator-validity-summary-table.md',
							},
							{
								text: '21.6.15.3 Blocos ndbinfo da Tabela',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/15-ndbinfo-the-n-d-b-cluster-information-database/03-the-ndbinfo-blocks-table.md',
							},
							{
								text: '21.6.15.4 A tabela ndbinfo cluster_locks',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/15-ndbinfo-the-n-d-b-cluster-information-database/04-the-ndbinfo-cluster-locks-table.md',
							},
							{
								text: '21.6.15.5 A tabela ndbinfo cluster_operations',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/15-ndbinfo-the-n-d-b-cluster-information-database/05-the-ndbinfo-cluster-operations-table.md',
							},
							{
								text: '21.6.15.6 A tabela ndbinfo cluster_transactions',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/15-ndbinfo-the-n-d-b-cluster-information-database/06-the-ndbinfo-cluster-transactions-table.md',
							},
							{
								text: '21.6.15.7 Tabela ndbinfo config_nodes',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/15-ndbinfo-the-n-d-b-cluster-information-database/07-the-ndbinfo-config-nodes-table.md',
							},
							{
								text: '21.6.15.8 Tabela ndbinfo config_params',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/15-ndbinfo-the-n-d-b-cluster-information-database/08-the-ndbinfo-config-params-table.md',
							},
							{
								text: '21.6.15.9 A tabela ndbinfo config_values',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/15-ndbinfo-the-n-d-b-cluster-information-database/09-the-ndbinfo-config-values-table.md',
							},
							{
								text: '21.6.15.10 Contas da tabela ndbinfo',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/15-ndbinfo-the-n-d-b-cluster-information-database/10-the-ndbinfo-counters-table.md',
							},
							{
								text: '21.6.15.11 Tabela ndbinfo cpustat',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/15-ndbinfo-the-n-d-b-cluster-information-database/11-the-ndbinfo-cpustat-table.md',
							},
							{
								text: '21.6.15.12 Tabela ndbinfo cpustat_50ms',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/15-ndbinfo-the-n-d-b-cluster-information-database/12-the-ndbinfo-cpustat-50-ms-table.md',
							},
							{
								text: '21.6.15.13 Tabela ndbinfo cpustat_1sec',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/15-ndbinfo-the-n-d-b-cluster-information-database/13-the-ndbinfo-cpustat-1-sec-table.md',
							},
							{
								text: '21.6.15.14 Tabela ndbinfo cpustat_20sec',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/15-ndbinfo-the-n-d-b-cluster-information-database/14-the-ndbinfo-cpustat-20-sec-table.md',
							},
							{
								text: '21.6.15.15 Tabela ndbinfo dict_obj_info',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/15-ndbinfo-the-n-d-b-cluster-information-database/15-the-ndbinfo-dict-obj-info-table.md',
							},
							{
								text: '21.6.15.16 Tabela ndbinfo dict_obj_types',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/15-ndbinfo-the-n-d-b-cluster-information-database/16-the-ndbinfo-dict-obj-types-table.md',
							},
							{
								text: '21.6.15.17 Tabela ndbinfo disk_write_speed_base',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/15-ndbinfo-the-n-d-b-cluster-information-database/17-the-ndbinfo-disk-write-speed-base-table.md',
							},
							{
								text: '21.6.15.18 Tabela ndbinfo disk_write_speed_aggregate',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/15-ndbinfo-the-n-d-b-cluster-information-database/18-the-ndbinfo-disk-write-speed-aggregate-table.md',
							},
							{
								text: '21.6.15.19 Tabela ndbinfo disk_write_speed_aggregate_node',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/15-ndbinfo-the-n-d-b-cluster-information-database/19-the-ndbinfo-disk-write-speed-aggregate-node-table.md',
							},
							{
								text: '21.6.15.20 A tabela ndbinfo diskpagebuffer',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/15-ndbinfo-the-n-d-b-cluster-information-database/20-the-ndbinfo-diskpagebuffer-table.md',
							},
							{
								text: '21.6.15.21 Tabela de mensagens de erro ndbinfo_messages',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/15-ndbinfo-the-n-d-b-cluster-information-database/21-the-ndbinfo-error-messages-table.md',
							},
							{
								text: '21.6.15.22 Tabela ndbinfo locks_per_fragment',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/15-ndbinfo-the-n-d-b-cluster-information-database/22-the-ndbinfo-locks-per-fragment-table.md',
							},
							{
								text: '21.6.15.23 A tabela ndbinfo logbuffers',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/15-ndbinfo-the-n-d-b-cluster-information-database/23-the-ndbinfo-logbuffers-table.md',
							},
							{
								text: '21.6.15.24 Tabela ndbinfo logspaces',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/15-ndbinfo-the-n-d-b-cluster-information-database/24-the-ndbinfo-logspaces-table.md',
							},
							{
								text: '21.6.15.25 Tabela de associação ndbinfo',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/15-ndbinfo-the-n-d-b-cluster-information-database/25-the-ndbinfo-membership-table.md',
							},
							{
								text: '21.6.15.26 Tabela ndbinfo memoryusage',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/15-ndbinfo-the-n-d-b-cluster-information-database/26-the-ndbinfo-memoryusage-table.md',
							},
							{
								text: '21.6.15.27 Tabela ndbinfo memory_per_fragment',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/15-ndbinfo-the-n-d-b-cluster-information-database/27-the-ndbinfo-memory-per-fragment-table.md',
							},
							{
								text: '21.6.15.28 Tabela de nós ndbinfo',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/15-ndbinfo-the-n-d-b-cluster-information-database/28-the-ndbinfo-nodes-table.md',
							},
							{
								text: '21.6.15.29 Tabela ndbinfo operations_per_fragment',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/15-ndbinfo-the-n-d-b-cluster-information-database/29-the-ndbinfo-operations-per-fragment-table.md',
							},
							{
								text: '21.6.15.30 O ndbinfo processa a tabela',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/15-ndbinfo-the-n-d-b-cluster-information-database/30-the-ndbinfo-processes-table.md',
							},
							{
								text: '21.6.15.31 A tabela de recursos ndbinfo',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/15-ndbinfo-the-n-d-b-cluster-information-database/31-the-ndbinfo-resources-table.md',
							},
							{
								text: '21.6.15.32 Tabela ndbinfo restart_info',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/15-ndbinfo-the-n-d-b-cluster-information-database/32-the-ndbinfo-restart-info-table.md',
							},
							{
								text: '21.6.15.33 Tabela ndbinfo server_locks',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/15-ndbinfo-the-n-d-b-cluster-information-database/33-the-ndbinfo-server-locks-table.md',
							},
							{
								text: '21.6.15.34 Tabela servidor_operações ndbinfo',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/15-ndbinfo-the-n-d-b-cluster-information-database/34-the-ndbinfo-server-operations-table.md',
							},
							{
								text: '21.6.15.35 A tabela ndbinfo server_transactions',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/15-ndbinfo-the-n-d-b-cluster-information-database/35-the-ndbinfo-server-transactions-table.md',
							},
							{
								text: '21.6.15.36 A tabela ndbinfo table_distribution_status',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/15-ndbinfo-the-n-d-b-cluster-information-database/36-the-ndbinfo-table-distribution-status-table.md',
							},
							{
								text: '21.6.15.37 A tabela ndbinfo table_fragments',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/15-ndbinfo-the-n-d-b-cluster-information-database/37-the-ndbinfo-table-fragments-table.md',
							},
							{
								text: '21.6.15.38 A tabela ndbinfo table_info',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/15-ndbinfo-the-n-d-b-cluster-information-database/38-the-ndbinfo-table-info-table.md',
							},
							{
								text: '21.6.15.39 A tabela ndbinfo table_replicas',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/15-ndbinfo-the-n-d-b-cluster-information-database/39-the-ndbinfo-table-replicas-table.md',
							},
							{
								text: '21.6.15.40 A tabela ndbinfo tc_time_track_stats',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/15-ndbinfo-the-n-d-b-cluster-information-database/40-the-ndbinfo-tc-time-track-stats-table.md',
							},
							{
								text: '21.6.15.41 Blocos de execução de threads ndbinfo Tabela',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/15-ndbinfo-the-n-d-b-cluster-information-database/41-the-ndbinfo-threadblocks-table.md',
							},
							{
								text: '21.6.15.42 Tabela de threads ndbinfo',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/15-ndbinfo-the-n-d-b-cluster-information-database/42-the-ndbinfo-threads-table.md',
							},
							{
								text: '21.6.15.43 A tabela Threadstat do ndbinfo',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/15-ndbinfo-the-n-d-b-cluster-information-database/43-the-ndbinfo-threadstat-table.md',
							},
							{
								text: '21.6.15.44 Tabela de transportadores ndbinfo',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/15-ndbinfo-the-n-d-b-cluster-information-database/44-the-ndbinfo-transporters-table.md',
							},
						],
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/15-ndbinfo-the-n-d-b-cluster-information-database/index.md',
					},
					{
						text: '21.6.18 Problemas de segurança do cluster do NDB',
						collapsed: true,
						items: [
							{
								text: '21.6.18.1 Problemas de segurança e de rede do cluster NDB',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/18-n-d-b-cluster-security-issues/01-n-d-b-cluster-security-and-networking-issues.md',
							},
							{
								text: '21.6.18.2 NDB Cluster e privilégios do MySQL',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/18-n-d-b-cluster-security-issues/02-n-d-b-cluster-and-my-s-q-l-privileges.md',
							},
							{
								text: '21.6.18.3 Procedimentos de segurança do NDB Cluster e MySQL',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/18-n-d-b-cluster-security-issues/03-n-d-b-cluster-and-my-s-q-l-security-procedures.md',
							},
						],
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/18-n-d-b-cluster-security-issues/index.md',
					},
				],
				link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/06-management-of-n-d-b-cluster/index.md',
			},
			{
				text: '21.7 Replicação em cluster do NDB',
				collapsed: true,
				items: [
					{
						text: '21.7.1 Replicação em cluster do NDB: Abreviações e Símbolos',
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/07-n-d-b-cluster-replication/01-n-d-b-cluster-replication-abbreviations-and-symbols.md',
					},
					{
						text: '21.7.2 Requisitos Gerais para a Replicação em Clúster do NDB',
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/07-n-d-b-cluster-replication/02-general-requirements-for-n-d-b-cluster-replication.md',
					},
					{
						text: '21.7.3 Problemas Conhecidos na Replicação em NDB Cluster',
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/07-n-d-b-cluster-replication/03-known-issues-in-n-d-b-cluster-replication.md',
					},
					{
						text: '21.7.4 Esquema e tabelas de replicação de cluster do NDB',
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/07-n-d-b-cluster-replication/04-n-d-b-cluster-replication-schema-and-tables.md',
					},
					{
						text: '21.7.5 Preparando o NDB Cluster para Replicação',
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/07-n-d-b-cluster-replication/05-preparing-the-n-d-b-cluster-for-replication.md',
					},
					{
						text: '21.7.6 Início da replicação do cluster NDB (canal de replicação único)',
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/07-n-d-b-cluster-replication/06-starting-n-d-b-cluster-replication-single-replication-channel.md',
					},
					{
						text: '21.7.7 Usar dois canais de replicação para a replicação de clusters NDB',
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/07-n-d-b-cluster-replication/07-using-two-replication-channels-for-n-d-b-cluster-replication.md',
					},
					{
						text: '21.7.8 Implementando Failover com a Replicação do NDB Cluster',
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/07-n-d-b-cluster-replication/08-implementing-failover-with-n-d-b-cluster-replication.md',
					},
					{
						text: '21.7.10 Replicação em cluster do NDB: Replicação bidirecional e circular',
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/07-n-d-b-cluster-replication/10-n-d-b-cluster-replication-bidirectional-and-circular-replication.md',
					},
					{
						text: '21.7.11 Resolução de conflitos na replicação em cluster do NDB',
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/07-n-d-b-cluster-replication/11-n-d-b-cluster-replication-conflict-resolution.md',
					},
					{
						text: '21.7.9 Resgate de clusters NDB Com a Replicação do NDB Cluster',
						collapsed: true,
						items: [
							{
								text: '21.7.9.1 Replicação em Cluster do NDB: Automatização da Sincronização da Replicação com o Log Binário de Fonte',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/07-n-d-b-cluster-replication/09-n-d-b-cluster-backups-with-n-d-b-cluster-replication/01-n-d-b-cluster-replication-automating-synchronization-of-the-replica-to-the-source-binary-log.md',
							},
							{
								text: '21.7.9.2 Recuperação em Ponto de Tempo Usando a Replicação do NDB Cluster',
								link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/07-n-d-b-cluster-replication/09-n-d-b-cluster-backups-with-n-d-b-cluster-replication/02-point-in-time-recovery-using-n-d-b-cluster-replication.md',
							},
						],
						link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/07-n-d-b-cluster-replication/09-n-d-b-cluster-backups-with-n-d-b-cluster-replication/index.md',
					},
				],
				link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/07-n-d-b-cluster-replication/index.md',
			},
		],
		link: '/22-mysql-ndb-cluster-7-5-ndb-cluster/index.md',
	},
	{
		text: 'Capítulo 22 Partição',
		collapsed: true,
		items: [
			{
				text: '22.1 Visão geral da partição no MySQL',
				link: '/23-partitioning/01-overview-of-partitioning-in-my-sql.md',
			},
			{
				text: '22.4 Recorte de Partição',
				link: '/23-partitioning/04-partition-pruning.md',
			},
			{
				text: '22.5 Seleção de Partição',
				link: '/23-partitioning/05-partition-selection.md',
			},
			{
				text: '22.2 Tipos de Partição',
				collapsed: true,
				items: [
					{
						text: '22.2.1 Partição de alcance',
						link: '/23-partitioning/02-partitioning-types/01-r-a-n-g-e-partitioning.md',
					},
					{
						text: '22.2.2 Partição da lista',
						link: '/23-partitioning/02-partitioning-types/02-l-i-s-t-partitioning.md',
					},
					{
						text: '22.2.5 Partição de chave',
						link: '/23-partitioning/02-partitioning-types/05-k-e-y-partitioning.md',
					},
					{
						text: '22.2.6 Subpartição',
						link: '/23-partitioning/02-partitioning-types/06-subpartitioning.md',
					},
					{
						text: '22.2.7 Como o Partição do MySQL lida com NULL',
						link: '/23-partitioning/02-partitioning-types/07-how-my-s-q-l-partitioning-handles-null.md',
					},
					{
						text: '22.2.3 COLUNAS Partição',
						collapsed: true,
						items: [
							{
								text: '22.2.3.1 Partição de colunas de intervalo',
								link: '/23-partitioning/02-partitioning-types/03-c-o-l-u-m-n-s-partitioning/01-r-a-n-g-e-c-o-l-u-m-n-s-partitioning.md',
							},
							{
								text: '22.2.3.2 Partição de colunas da lista',
								link: '/23-partitioning/02-partitioning-types/03-c-o-l-u-m-n-s-partitioning/02-l-i-s-t-c-o-l-u-m-n-s-partitioning.md',
							},
						],
						link: '/23-partitioning/02-partitioning-types/03-c-o-l-u-m-n-s-partitioning/index.md',
					},
					{
						text: '22.2.4 Partição HASH',
						collapsed: true,
						items: [
							{
								text: '22.2.4.1 Partição por Hash Linear',
								link: '/23-partitioning/02-partitioning-types/04-h-a-s-h-partitioning/01-l-i-n-e-a-r-h-a-s-h-partitioning.md',
							},
						],
						link: '/23-partitioning/02-partitioning-types/04-h-a-s-h-partitioning/index.md',
					},
				],
				link: '/23-partitioning/02-partitioning-types/index.md',
			},
			{
				text: '22.3 Gerenciamento de Partições',
				collapsed: true,
				items: [
					{
						text: '22.3.1 Gestão de Partições RANGE e LIST',
						link: '/23-partitioning/03-partition-management/01-management-of-r-a-n-g-e-and-l-i-s-t-partitions.md',
					},
					{
						text: '22.3.2 Gerenciamento das partições HASH e KEY',
						link: '/23-partitioning/03-partition-management/02-management-of-h-a-s-h-and-k-e-y-partitions.md',
					},
					{
						text: '22.3.3 Trocando Partições e Subpartições com Tabelas',
						link: '/23-partitioning/03-partition-management/03-exchanging-partitions-and-subpartitions-with-tables.md',
					},
					{
						text: '22.3.4 Manutenção de Partições',
						link: '/23-partitioning/03-partition-management/04-maintenance-of-partitions.md',
					},
					{
						text: '22.3.5 Obter informações sobre partições',
						link: '/23-partitioning/03-partition-management/05-obtaining-information-about-partitions.md',
					},
				],
				link: '/23-partitioning/03-partition-management/index.md',
			},
			{
				text: '22.6 Restrições e Limitações sobre a Partição',
				collapsed: true,
				items: [
					{
						text: '22.6.1 Chaves de Partição, Chaves Primárias e Chaves Únicas',
						link: '/23-partitioning/06-restrictions-and-limitations-on-partitioning/01-partitioning-keys-primary-keys-and-unique-keys.md',
					},
					{
						text: '22.6.2 Limitações de Partição Relacionadas a Motores de Armazenamento',
						link: '/23-partitioning/06-restrictions-and-limitations-on-partitioning/02-partitioning-limitations-relating-to-storage-engines.md',
					},
					{
						text: '22.6.3 Limitações de Partição Relacionadas a Funções',
						link: '/23-partitioning/06-restrictions-and-limitations-on-partitioning/03-partitioning-limitations-relating-to-functions.md',
					},
					{
						text: '22.6.4 Partição e bloqueio',
						link: '/23-partitioning/06-restrictions-and-limitations-on-partitioning/04-partitioning-and-locking.md',
					},
				],
				link: '/23-partitioning/06-restrictions-and-limitations-on-partitioning/index.md',
			},
		],
		link: '/23-partitioning/index.md',
	},
	{
		text: 'Capítulo 23 Objetos Armazenados',
		collapsed: true,
		items: [
			{
				text: '23.1 Definindo Programas Armazenados',
				link: '/24-stored-objects/01-defining-stored-programs.md',
			},
			{
				text: '23.6 Controle de acesso a objetos armazenados',
				link: '/24-stored-objects/06-stored-object-access-control.md',
			},
			{
				text: '23.7 Registro binário de programas armazenados',
				link: '/24-stored-objects/07-stored-program-binary-logging.md',
			},
			{
				text: '23.8 Restrições aos Programas Armazenados',
				link: '/24-stored-objects/08-restrictions-on-stored-programs.md',
			},
			{
				text: '23.9 Restrições sobre visualizações',
				link: '/24-stored-objects/09-restrictions-on-views.md',
			},
			{
				text: '23.2 Uso de Rotinas Armazenadas',
				collapsed: true,
				items: [
					{
						text: '23.2.1 Sintaxe de Rotina Armazenada',
						link: '/24-stored-objects/02-using-stored-routines/01-stored-routine-syntax.md',
					},
					{
						text: '23.2.2 Rotinas Armazenadas e Privilégios do MySQL',
						link: '/24-stored-objects/02-using-stored-routines/02-stored-routines-and-my-s-q-l-privileges.md',
					},
					{
						text: '23.2.3 Metadados de rotina armazenados',
						link: '/24-stored-objects/02-using-stored-routines/03-stored-routine-metadata.md',
					},
					{
						text: '23.2.4 Procedimentos armazenados, funções, gatilhos e LAST_INSERT_ID()',
						link: '/24-stored-objects/02-using-stored-routines/04-stored-procedures-functions-triggers-and-l-a-s-t-i-n-s-e-r-t-id.md',
					},
				],
				link: '/24-stored-objects/02-using-stored-routines/index.md',
			},
			{
				text: '23.3 Usando gatilhos',
				collapsed: true,
				items: [
					{
						text: '23.3.1 Sintaxe e exemplos de gatilho',
						link: '/24-stored-objects/03-using-triggers/01-trigger-syntax-and-examples.md',
					},
					{
						text: '23.3.2 Metadados de gatilho',
						link: '/24-stored-objects/03-using-triggers/02-trigger-metadata.md',
					},
				],
				link: '/24-stored-objects/03-using-triggers/index.md',
			},
			{
				text: '23.4 Usando o Agendamento de Eventos',
				collapsed: true,
				items: [
					{
						text: '23.4.1 Visão geral do Agendamento de Eventos',
						link: '/24-stored-objects/04-using-the-event-scheduler/01-event-scheduler-overview.md',
					},
					{
						text: '23.4.2 Configuração do Agendador de Eventos',
						link: '/24-stored-objects/04-using-the-event-scheduler/02-event-scheduler-configuration.md',
					},
					{
						text: '23.4.3 Sintaxe de eventos',
						link: '/24-stored-objects/04-using-the-event-scheduler/03-event-syntax.md',
					},
					{
						text: '23.4.4 Metadados do evento',
						link: '/24-stored-objects/04-using-the-event-scheduler/04-event-metadata.md',
					},
					{
						text: '23.4.5 Status do Cronômetro de Eventos',
						link: '/24-stored-objects/04-using-the-event-scheduler/05-event-scheduler-status.md',
					},
					{
						text: '23.4.6 O Agendamento de Eventos e Permissões do MySQL',
						link: '/24-stored-objects/04-using-the-event-scheduler/06-the-event-scheduler-and-my-s-q-l-privileges.md',
					},
				],
				link: '/24-stored-objects/04-using-the-event-scheduler/index.md',
			},
			{
				text: '23.5 Usando visualizações',
				collapsed: true,
				items: [
					{
						text: '23.5.1 Sintaxe de visualização',
						link: '/24-stored-objects/05-using-views/01-view-syntax.md',
					},
					{
						text: '23.5.2 Ver algoritmos de processamento',
						link: '/24-stored-objects/05-using-views/02-view-processing-algorithms.md',
					},
					{
						text: '23.5.3 Visualizações atualizáveis e inseríveis',
						link: '/24-stored-objects/05-using-views/03-updatable-and-insertable-views.md',
					},
					{
						text: '23.5.4 A cláusula Opção de Visualização COM opção de verificação',
						link: '/24-stored-objects/05-using-views/04-the-view-w-i-t-h-c-h-e-c-k-o-p-t-i-o-n-clause.md',
					},
					{
						text: '23.5.5 Ver metadados',
						link: '/24-stored-objects/05-using-views/05-view-metadata.md',
					},
				],
				link: '/24-stored-objects/05-using-views/index.md',
			},
		],
		link: '/24-stored-objects/index.md',
	},
	{
		text: 'Capítulo 24 PLANO DE TABELAS INFORMATION_SCHEMA',
		collapsed: true,
		items: [
			{
				text: '24.1 Introdução',
				link: '/25-informationschema-tables/01-introduction.md',
			},
			{
				text: '24.2 Tabela de Referência `INFORMATION_SCHEMA`',
				link: '/25-informationschema-tables/02-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-table-reference.md',
			},
			{
				text: '24.8 Extensões para declarações SHOW',
				link: '/25-informationschema-tables/08-extensions-to-s-h-o-w-statements.md',
			},
			{
				text: '24.3 INFORMATION_SCHEMA Tabelas Gerais',
				collapsed: true,
				items: [
					{
						text: '24.3.1 TABELA DE REFERÊNCIA DO SCHEMA DE INFORMAÇÕES Geral',
						link: '/25-informationschema-tables/03-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-general-tables/01-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-general-table-reference.md',
					},
					{
						text: '24.3.2 A tabela INFORMATION_SCHEMA CHARACTER_SETS',
						link: '/25-informationschema-tables/03-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-general-tables/02-the-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-c-h-a-r-a-c-t-e-r-s-e-t-s-table.md',
					},
					{
						text: '24.3.3 A tabela INFORMATION_SCHEMA COLLATIONS',
						link: '/25-informationschema-tables/03-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-general-tables/03-the-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-c-o-l-l-a-t-i-o-n-s-table.md',
					},
					{
						text: '24.3.4 A tabela INFORMATION_SCHEMA COLLATION_CHARACTER_SET_APPLICABILITY',
						link: '/25-informationschema-tables/03-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-general-tables/04-the-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-c-o-l-l-a-t-i-o-n-c-h-a-r-a-c-t-e-r-s-e-t-a-p-p-l-i-c-a-b-i-l-i-t-y-table.md',
					},
					{
						text: '24.3.5 A tabela INFORMATION_SCHEMA COLUMNS',
						link: '/25-informationschema-tables/03-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-general-tables/05-the-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-c-o-l-u-m-n-s-table.md',
					},
					{
						text: '24.3.6 A tabela INFORMATION_SCHEMA COLUMN_PRIVILEGES',
						link: '/25-informationschema-tables/03-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-general-tables/06-the-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-c-o-l-u-m-n-p-r-i-v-i-l-e-g-e-s-table.md',
					},
					{
						text: '24.3.7 A Tabela INFORMATION_SCHEMA ENGINES',
						link: '/25-informationschema-tables/03-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-general-tables/07-the-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-e-n-g-i-n-e-s-table.md',
					},
					{
						text: '24.3.8 A tabela INFORMATION_SCHEMA EVENTS',
						link: '/25-informationschema-tables/03-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-general-tables/08-the-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-e-v-e-n-t-s-table.md',
					},
					{
						text: '24.3.9 A tabela INFORMATION_SCHEMA FILES',
						link: '/25-informationschema-tables/03-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-general-tables/09-the-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-f-i-l-e-s-table.md',
					},
					{
						text: '24.3.10 Tabelas INFORMATION_SCHEMA GLOBAL_STATUS e SESSION_STATUS',
						link: '/25-informationschema-tables/03-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-general-tables/10-the-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-g-l-o-b-a-l-s-t-a-t-u-s-and-s-e-s-s-i-o-n-s-t-a-t-u-s-tables.md',
					},
					{
						text: '24.3.11 Tabelas INFORMATION_SCHEMA GLOBAL_VARIABLES e SESSION_VARIABLES',
						link: '/25-informationschema-tables/03-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-general-tables/11-the-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-g-l-o-b-a-l-v-a-r-i-a-b-l-e-s-and-s-e-s-s-i-o-n-v-a-r-i-a-b-l-e-s-tables.md',
					},
					{
						text: '24.3.12 A tabela INFORMATION_SCHEMA KEY_COLUMN_USAGE',
						link: '/25-informationschema-tables/03-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-general-tables/12-the-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-k-e-y-c-o-l-u-m-n-u-s-a-g-e-table.md',
					},
					{
						text: '24.3.13 A tabela INFORMATION_SCHEMA ndb_transid_mysql_connection_map',
						link: '/25-informationschema-tables/03-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-general-tables/13-the-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-ndb-transid-mysql-connection-map-table.md',
					},
					{
						text: '24.3.14 A tabela INFORMATION_SCHEMA OPTIMIZER_TRACE',
						link: '/25-informationschema-tables/03-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-general-tables/14-the-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-o-p-t-i-m-i-z-e-r-t-r-a-c-e-table.md',
					},
					{
						text: '24.3.15 A tabela INFORMATION_SCHEMA PARAMETERS',
						link: '/25-informationschema-tables/03-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-general-tables/15-the-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-p-a-r-a-m-e-t-e-r-s-table.md',
					},
					{
						text: '24.3.16 A tabela INFORMATION_SCHEMA PARTITIONS',
						link: '/25-informationschema-tables/03-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-general-tables/16-the-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-p-a-r-t-i-t-i-o-n-s-table.md',
					},
					{
						text: '24.3.17 A tabela INFORMATION_SCHEMA PLUGINS',
						link: '/25-informationschema-tables/03-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-general-tables/17-the-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-p-l-u-g-i-n-s-table.md',
					},
					{
						text: '24.3.18 A tabela INFORMATION_SCHEMA PROCESSLIST',
						link: '/25-informationschema-tables/03-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-general-tables/18-the-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-p-r-o-c-e-s-s-l-i-s-t-table.md',
					},
					{
						text: '24.3.19 A tabela INFORMATION_SCHEMA PROFILING',
						link: '/25-informationschema-tables/03-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-general-tables/19-the-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-p-r-o-f-i-l-i-n-g-table.md',
					},
					{
						text: '24.3.20 Tabela INFORMATION_SCHEMA REFERENTIAL_CONSTRAINTS',
						link: '/25-informationschema-tables/03-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-general-tables/20-the-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-r-e-f-e-r-e-n-t-i-a-l-c-o-n-s-t-r-a-i-n-t-s-table.md',
					},
					{
						text: '24.3.21 A tabela Tabela de rotinas do esquema de informações',
						link: '/25-informationschema-tables/03-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-general-tables/21-the-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-r-o-u-t-i-n-e-s-table.md',
					},
					{
						text: '24.3.22 A tabela INFORMATION_SCHEMA SCHEMATA',
						link: '/25-informationschema-tables/03-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-general-tables/22-the-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-s-c-h-e-m-a-t-a-table.md',
					},
					{
						text: '24.3.23 A tabela INFORMATION_SCHEMA SCHEMA_PRIVILEGES',
						link: '/25-informationschema-tables/03-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-general-tables/23-the-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-s-c-h-e-m-a-p-r-i-v-i-l-e-g-e-s-table.md',
					},
					{
						text: '24.3.24 A tabela INFORMATION_SCHEMA STATISTICS',
						link: '/25-informationschema-tables/03-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-general-tables/24-the-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-s-t-a-t-i-s-t-i-c-s-table.md',
					},
					{
						text: '24.3.25 A tabela INFORMATION_SCHEMA TABLES',
						link: '/25-informationschema-tables/03-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-general-tables/25-the-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-t-a-b-l-e-s-table.md',
					},
					{
						text: '24.3.26 A tabela INFORMATION_SCHEMA TABLESPACES',
						link: '/25-informationschema-tables/03-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-general-tables/26-the-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-t-a-b-l-e-s-p-a-c-e-s-table.md',
					},
					{
						text: '24.3.27 A tabela INFORMATION_SCHEMA TABLE_CONSTRAINTS',
						link: '/25-informationschema-tables/03-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-general-tables/27-the-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-t-a-b-l-e-c-o-n-s-t-r-a-i-n-t-s-table.md',
					},
					{
						text: '24.3.28 A tabela INFORMATION_SCHEMA TABLE_PRIVILEGES',
						link: '/25-informationschema-tables/03-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-general-tables/28-the-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-t-a-b-l-e-p-r-i-v-i-l-e-g-e-s-table.md',
					},
					{
						text: '24.3.29 A tabela INFORMATION_SCHEMA TRIGGERS',
						link: '/25-informationschema-tables/03-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-general-tables/29-the-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-t-r-i-g-g-e-r-s-table.md',
					},
					{
						text: '24.3.30 A tabela INFORMATION_SCHEMA USER_PRIVILEGES',
						link: '/25-informationschema-tables/03-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-general-tables/30-the-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-u-s-e-r-p-r-i-v-i-l-e-g-e-s-table.md',
					},
					{
						text: '24.3.31 A tabela INFORMATION_SCHEMA VIEWS',
						link: '/25-informationschema-tables/03-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-general-tables/31-the-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-v-i-e-w-s-table.md',
					},
				],
				link: '/25-informationschema-tables/03-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-general-tables/index.md',
			},
			{
				text: '24.4 INFORMATION_SCHEMA Tabelas InnoDB',
				collapsed: true,
				items: [
					{
						text: '24.4.1 INFORMATION_SCHEMA Referência da Tabela InnoDB',
						link: '/25-informationschema-tables/04-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-inno-d-b-tables/01-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-inno-d-b-table-reference.md',
					},
					{
						text: '24.4.2 A tabela INFORMATION_SCHEMA INNODB_BUFFER_PAGE',
						link: '/25-informationschema-tables/04-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-inno-d-b-tables/02-the-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-i-n-n-o-d-b-b-u-f-f-e-r-p-a-g-e-table.md',
					},
					{
						text: '24.4.3 A tabela INFORMATION_SCHEMA INNODB_BUFFER_PAGE_LRU',
						link: '/25-informationschema-tables/04-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-inno-d-b-tables/03-the-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-i-n-n-o-d-b-b-u-f-f-e-r-p-a-g-e-l-r-u-table.md',
					},
					{
						text: '24.4.4 A tabela INFORMATION_SCHEMA INNODB_BUFFER_POOL_STATS',
						link: '/25-informationschema-tables/04-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-inno-d-b-tables/04-the-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-i-n-n-o-d-b-b-u-f-f-e-r-p-o-o-l-s-t-a-t-s-table.md',
					},
					{
						text: '24.4.5 As tabelas INFORMATION_SCHEMA INNODB_CMP e INNODB_CMP_RESET',
						link: '/25-informationschema-tables/04-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-inno-d-b-tables/05-the-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-i-n-n-o-d-b-c-m-p-and-i-n-n-o-d-b-c-m-p-r-e-s-e-t-tables.md',
					},
					{
						text: '24.4.6 As tabelas INFORMATION_SCHEMA INNODB_CMPMEM e INNODB_CMPMEM_RESET',
						link: '/25-informationschema-tables/04-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-inno-d-b-tables/06-the-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-i-n-n-o-d-b-c-m-p-m-e-m-and-i-n-n-o-d-b-c-m-p-m-e-m-r-e-s-e-t-tables.md',
					},
					{
						text: '24.4.7 As tabelas INFORMATION_SCHEMA INNODB_CMP_PER_INDEX e INNODB_CMP_PER_INDEX_RESET',
						link: '/25-informationschema-tables/04-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-inno-d-b-tables/07-the-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-i-n-n-o-d-b-c-m-p-p-e-r-i-n-d-e-x-and-i-n-n-o-d-b-c-m-p-p-e-r-i-n-d-e-x-r-e-s-e-t-tables.md',
					},
					{
						text: '24.4.8 A tabela INFORMATION_SCHEMA INNODB_FT_BEING_DELETED',
						link: '/25-informationschema-tables/04-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-inno-d-b-tables/08-the-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-i-n-n-o-d-b-f-t-b-e-i-n-g-d-e-l-e-t-e-d-table.md',
					},
					{
						text: '24.4.9 A tabela INFORMATION_SCHEMA INNODB_FT_CONFIG',
						link: '/25-informationschema-tables/04-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-inno-d-b-tables/09-the-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-i-n-n-o-d-b-f-t-c-o-n-f-i-g-table.md',
					},
					{
						text: '24.4.10 A tabela INFORMATION_SCHEMA INNODB_FT_DEFAULT_STOPWORD',
						link: '/25-informationschema-tables/04-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-inno-d-b-tables/10-the-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-i-n-n-o-d-b-f-t-d-e-f-a-u-l-t-s-t-o-p-w-o-r-d-table.md',
					},
					{
						text: '24.4.11 A tabela INFORMATION_SCHEMA INNODB_FT_DELETED',
						link: '/25-informationschema-tables/04-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-inno-d-b-tables/11-the-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-i-n-n-o-d-b-f-t-d-e-l-e-t-e-d-table.md',
					},
					{
						text: '24.4.12 A tabela INFORMATION_SCHEMA INNODB_FT_INDEX_CACHE',
						link: '/25-informationschema-tables/04-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-inno-d-b-tables/12-the-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-i-n-n-o-d-b-f-t-i-n-d-e-x-c-a-c-h-e-table.md',
					},
					{
						text: '24.4.13 A tabela INFORMATION_SCHEMA INNODB_FT_INDEX_TABLE',
						link: '/25-informationschema-tables/04-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-inno-d-b-tables/13-the-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-i-n-n-o-d-b-f-t-i-n-d-e-x-t-a-b-l-e-table.md',
					},
					{
						text: '24.4.14 A tabela INFORMATION_SCHEMA INNODB_LOCKS',
						link: '/25-informationschema-tables/04-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-inno-d-b-tables/14-the-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-i-n-n-o-d-b-l-o-c-k-s-table.md',
					},
					{
						text: '24.4.15 A tabela INFORMATION_SCHEMA INNODB_LOCK_WAITS',
						link: '/25-informationschema-tables/04-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-inno-d-b-tables/15-the-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-i-n-n-o-d-b-l-o-c-k-w-a-i-t-s-table.md',
					},
					{
						text: '24.4.16 A tabela INFORMATION_SCHEMA INNODB_METRICS',
						link: '/25-informationschema-tables/04-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-inno-d-b-tables/16-the-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-i-n-n-o-d-b-m-e-t-r-i-c-s-table.md',
					},
					{
						text: '24.4.17 A tabela INFORMATION_SCHEMA INNODB_SYS_COLUMNS',
						link: '/25-informationschema-tables/04-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-inno-d-b-tables/17-the-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-i-n-n-o-d-b-s-y-s-c-o-l-u-m-n-s-table.md',
					},
					{
						text: '24.4.18 A tabela INFORMATION_SCHEMA INNODB_SYS_DATAFILES',
						link: '/25-informationschema-tables/04-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-inno-d-b-tables/18-the-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-i-n-n-o-d-b-s-y-s-d-a-t-a-f-i-l-e-s-table.md',
					},
					{
						text: '24.4.19 A tabela INFORMATION_SCHEMA INNODB_SYS_FIELDS',
						link: '/25-informationschema-tables/04-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-inno-d-b-tables/19-the-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-i-n-n-o-d-b-s-y-s-f-i-e-l-d-s-table.md',
					},
					{
						text: '24.4.20 Tabela INFORMATION_SCHEMA INNODB_SYS_FOREIGN',
						link: '/25-informationschema-tables/04-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-inno-d-b-tables/20-the-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-i-n-n-o-d-b-s-y-s-f-o-r-e-i-g-n-table.md',
					},
					{
						text: '24.4.21 A tabela INFORMATION_SCHEMA INNODB_SYS_FOREIGN_COLS',
						link: '/25-informationschema-tables/04-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-inno-d-b-tables/21-the-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-i-n-n-o-d-b-s-y-s-f-o-r-e-i-g-n-c-o-l-s-table.md',
					},
					{
						text: '24.4.22 A tabela INFORMATION_SCHEMA INNODB_SYS_INDEXES',
						link: '/25-informationschema-tables/04-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-inno-d-b-tables/22-the-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-i-n-n-o-d-b-s-y-s-i-n-d-e-x-e-s-table.md',
					},
					{
						text: '24.4.23 A tabela INFORMATION_SCHEMA INNODB_SYS_TABLES',
						link: '/25-informationschema-tables/04-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-inno-d-b-tables/23-the-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-i-n-n-o-d-b-s-y-s-t-a-b-l-e-s-table.md',
					},
					{
						text: '24.4.24 A tabela INFORMATION_SCHEMA INNODB_SYS_TABLESPACES',
						link: '/25-informationschema-tables/04-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-inno-d-b-tables/24-the-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-i-n-n-o-d-b-s-y-s-t-a-b-l-e-s-p-a-c-e-s-table.md',
					},
					{
						text: '24.4.25 A visão INFORMATION_SCHEMA INNODB_SYS_TABLESTATS',
						link: '/25-informationschema-tables/04-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-inno-d-b-tables/25-the-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-i-n-n-o-d-b-s-y-s-t-a-b-l-e-s-t-a-t-s-view.md',
					},
					{
						text: '24.4.26 A tabela INFORMATION_SCHEMA INNODB_SYS_VIRTUAL',
						link: '/25-informationschema-tables/04-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-inno-d-b-tables/26-the-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-i-n-n-o-d-b-s-y-s-v-i-r-t-u-a-l-table.md',
					},
					{
						text: '24.4.27 A tabela INFORMATION_SCHEMA INNODB_TEMP_TABLE_INFO',
						link: '/25-informationschema-tables/04-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-inno-d-b-tables/27-the-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-i-n-n-o-d-b-t-e-m-p-t-a-b-l-e-i-n-f-o-table.md',
					},
					{
						text: '24.4.28 A tabela INFORMATION_SCHEMA INNODB_TRX',
						link: '/25-informationschema-tables/04-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-inno-d-b-tables/28-the-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-i-n-n-o-d-b-t-r-x-table.md',
					},
				],
				link: '/25-informationschema-tables/04-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-inno-d-b-tables/index.md',
			},
			{
				text: '24.5 Tabelas do Pool de Fios do Schema de Informação',
				collapsed: true,
				items: [
					{
						text: '24.5.1 Informações_Schema Referência da Tabela do Conjunto de Filas Thread',
						link: '/25-informationschema-tables/05-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-thread-pool-tables/01-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-thread-pool-table-reference.md',
					},
					{
						text: '24.5.2 A tabela INFORMATION_SCHEMA TP_THREAD_GROUP_STATE',
						link: '/25-informationschema-tables/05-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-thread-pool-tables/02-the-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-t-p-t-h-r-e-a-d-g-r-o-u-p-s-t-a-t-e-table.md',
					},
					{
						text: '24.5.3 A tabela INFORMATION_SCHEMA TP_THREAD_GROUP_STATS',
						link: '/25-informationschema-tables/05-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-thread-pool-tables/03-the-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-t-p-t-h-r-e-a-d-g-r-o-u-p-s-t-a-t-s-table.md',
					},
					{
						text: '24.5.4 A tabela INFORMATION_SCHEMA TP_THREAD_STATE',
						link: '/25-informationschema-tables/05-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-thread-pool-tables/04-the-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-t-p-t-h-r-e-a-d-s-t-a-t-e-table.md',
					},
				],
				link: '/25-informationschema-tables/05-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-thread-pool-tables/index.md',
			},
			{
				text: '24.6 TABELAS DE CONTROLE DE CONEXÃO DO SCHEMA DE INFORMAÇÕES',
				collapsed: true,
				items: [
					{
						text: '24.6.1 TABELA DE CONTROLE DE CONEXÃO DO SCHEMA DE INFORMAÇÕES',
						link: '/25-informationschema-tables/06-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-connection-control-tables/01-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-connection-control-table-reference.md',
					},
					{
						text: '24.6.2 A tabela INFORMATION_SCHEMA CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS',
						link: '/25-informationschema-tables/06-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-connection-control-tables/02-the-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-c-o-n-n-e-c-t-i-o-n-c-o-n-t-r-o-l-f-a-i-l-e-d-l-o-g-i-n-a-t-t-e-m-p-t-s-table.md',
					},
				],
				link: '/25-informationschema-tables/06-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-connection-control-tables/index.md',
			},
			{
				text: '24.7 INFORMATION_SCHEMA MySQL Enterprise Firewall Tables',
				collapsed: true,
				items: [
					{
						text: '24.7.1 Informações sobre a tabela Firewall do esquema de banco de dados',
						link: '/25-informationschema-tables/07-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-my-s-q-l-enterprise-firewall-tables/01-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-firewall-table-reference.md',
					},
					{
						text: '24.7.2 A tabela INFORMATION_SCHEMA MYSQL_FIREWALL_USERS',
						link: '/25-informationschema-tables/07-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-my-s-q-l-enterprise-firewall-tables/02-the-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-m-y-s-q-l-f-i-r-e-w-a-l-l-u-s-e-r-s-table.md',
					},
					{
						text: '24.7.3 A tabela INFORMATION_SCHEMA MYSQL_FIREWALL_WHITELIST',
						link: '/25-informationschema-tables/07-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-my-s-q-l-enterprise-firewall-tables/03-the-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-m-y-s-q-l-f-i-r-e-w-a-l-l-w-h-i-t-e-l-i-s-t-table.md',
					},
				],
				link: '/25-informationschema-tables/07-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-my-s-q-l-enterprise-firewall-tables/index.md',
			},
		],
		link: '/25-informationschema-tables/index.md',
	},
	{
		text: 'Capítulo 25: Símio de Desempenho do MySQL',
		collapsed: true,
		items: [
			{
				text: '25.1 Início Rápido do Schema de Desempenho',
				link: '/26-mysql-performance-schema/01-performance-schema-quick-start.md',
			},
			{
				text: '25.2 Configuração de construção do esquema de desempenho',
				link: '/26-mysql-performance-schema/02-performance-schema-build-configuration.md',
			},
			{
				text: '25.3 Configuração de inicialização do esquema de desempenho',
				link: '/26-mysql-performance-schema/03-performance-schema-startup-configuration.md',
			},
			{
				text: '25.5 Consultas do Schema de Desempenho',
				link: '/26-mysql-performance-schema/05-performance-schema-queries.md',
			},
			{
				text: '25.6 Convenções de Nomenclatura de Instrumentos do Schema de Desempenho',
				link: '/26-mysql-performance-schema/06-performance-schema-instrument-naming-conventions.md',
			},
			{
				text: '25.7 Monitoramento do estado do esquema de desempenho',
				link: '/26-mysql-performance-schema/07-performance-schema-status-monitoring.md',
			},
			{
				text: '25.8 Eventos de Átomo e Molécula do Schema de Desempenho',
				link: '/26-mysql-performance-schema/08-performance-schema-atom-and-molecule-events.md',
			},
			{
				text: '25.9 Tabelas do Schema de Desempenho para Eventos Atuais e Históricos',
				link: '/26-mysql-performance-schema/09-performance-schema-tables-for-current-and-historical-events.md',
			},
			{
				text: '25.10 Resumo das declarações do esquema de desempenho',
				link: '/26-mysql-performance-schema/10-performance-schema-statement-digests.md',
			},
			{
				text: '25.11 Características gerais da tabela do esquema de desempenho',
				link: '/26-mysql-performance-schema/11-performance-schema-general-table-characteristics.md',
			},
			{
				text: '25.13 Opção de Schema de Desempenho e Referência de Variável',
				link: '/26-mysql-performance-schema/13-performance-schema-option-and-variable-reference.md',
			},
			{
				text: '25.14 Opções de comando do esquema de desempenho',
				link: '/26-mysql-performance-schema/14-performance-schema-command-options.md',
			},
			{
				text: '25.15 Variáveis do Sistema de Schema de Desempenho',
				link: '/26-mysql-performance-schema/15-performance-schema-system-variables.md',
			},
			{
				text: '25.16 Variáveis de status do esquema de desempenho',
				link: '/26-mysql-performance-schema/16-performance-schema-status-variables.md',
			},
			{
				text: '25.17 Modelo de Alocação de Memória do Schema de Desempenho',
				link: '/26-mysql-performance-schema/17-the-performance-schema-memory-allocation-model.md',
			},
			{
				text: '25.18 Schema de desempenho e plugins',
				link: '/26-mysql-performance-schema/18-performance-schema-and-plugins.md',
			},
			{
				text: '25.20 Migrando para o Sistema de Schema de Desempenho e Tabelas de Variáveis de Status',
				link: '/26-mysql-performance-schema/20-migrating-to-performance-schema-system-and-status-variable-tables.md',
			},
			{
				text: '25.21 Restrições ao Schema de Desempenho',
				link: '/26-mysql-performance-schema/21-restrictions-on-performance-schema.md',
			},
			{
				text: '25.4 Configuração de execução do esquema de desempenho',
				collapsed: true,
				items: [
					{
						text: '25.4.1 Cronometragem de eventos do esquema de desempenho',
						link: '/26-mysql-performance-schema/04-performance-schema-runtime-configuration/01-performance-schema-event-timing.md',
					},
					{
						text: '25.4.2 Filtragem de eventos do esquema de desempenho',
						link: '/26-mysql-performance-schema/04-performance-schema-runtime-configuration/02-performance-schema-event-filtering.md',
					},
					{
						text: '25.4.3 Pré-filtragem de eventos',
						link: '/26-mysql-performance-schema/04-performance-schema-runtime-configuration/03-event-pre-filtering.md',
					},
					{
						text: '25.4.4 Pré-filtragem por instrumento',
						link: '/26-mysql-performance-schema/04-performance-schema-runtime-configuration/04-pre-filtering-by-instrument.md',
					},
					{
						text: '25.4.5 Pré-filtragem por Objeto',
						link: '/26-mysql-performance-schema/04-performance-schema-runtime-configuration/05-pre-filtering-by-object.md',
					},
					{
						text: '25.4.6 Pré-filtragem por Fio',
						link: '/26-mysql-performance-schema/04-performance-schema-runtime-configuration/06-pre-filtering-by-thread.md',
					},
					{
						text: '25.4.7 Pré-filtragem pelo consumidor',
						link: '/26-mysql-performance-schema/04-performance-schema-runtime-configuration/07-pre-filtering-by-consumer.md',
					},
					{
						text: '25.4.8 Exemplo de configurações do consumidor',
						link: '/26-mysql-performance-schema/04-performance-schema-runtime-configuration/08-example-consumer-configurations.md',
					},
					{
						text: '25.4.9 Nomeação de Instrumentos ou Consumidores para Operações de Filtragem',
						link: '/26-mysql-performance-schema/04-performance-schema-runtime-configuration/09-naming-instruments-or-consumers-for-filtering-operations.md',
					},
					{
						text: '25.4.10 Determinar o que é instrumentado',
						link: '/26-mysql-performance-schema/04-performance-schema-runtime-configuration/10-determining-what-is-instrumented.md',
					},
				],
				link: '/26-mysql-performance-schema/04-performance-schema-runtime-configuration/index.md',
			},
			{
				text: '25.12 Descrições das tabelas do esquema de desempenho',
				collapsed: true,
				items: [
					{
						text: '25.12.1 Referência da Tabela do Schema de Desempenho',
						link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/01-performance-schema-table-reference.md',
					},
					{
						text: '25.12.10 Tabelas de variáveis definidas pelo usuário do esquema de desempenho',
						link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/10-performance-schema-user-defined-variable-tables.md',
					},
					{
						text: '25.12.13 Tabelas de variáveis do sistema do esquema de desempenho',
						link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/13-performance-schema-system-variable-tables.md',
					},
					{
						text: '25.12.14 Tabelas de variáveis de status do esquema de desempenho',
						link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/14-performance-schema-status-variable-tables.md',
					},
					{
						text: '25.12.1 Tabelas de configuração do esquema de desempenho',
						collapsed: true,
						items: [
							{
								text: '25.12.2.1 A tabela setup_actors',
								link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/02-performance-schema-setup-tables/01-the-setup-actors-table.md',
							},
							{
								text: '25.12.2.2 A tabela setup_consumers',
								link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/02-performance-schema-setup-tables/02-the-setup-consumers-table.md',
							},
							{
								text: '25.12.2.3 A tabela setup_instruments',
								link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/02-performance-schema-setup-tables/03-the-setup-instruments-table.md',
							},
							{
								text: '25.12.2.4 A tabela setup_objects',
								link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/02-performance-schema-setup-tables/04-the-setup-objects-table.md',
							},
							{
								text: '25.12.2.5 A tabela setup_timers',
								link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/02-performance-schema-setup-tables/05-the-setup-timers-table.md',
							},
						],
						link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/02-performance-schema-setup-tables/index.md',
					},
					{
						text: '25.12.3 Tabelas de Instâncias do Schema de Desempenho',
						collapsed: true,
						items: [
							{
								text: '25.12.3.1 A tabela cond_instances',
								link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/03-performance-schema-instance-tables/01-the-cond-instances-table.md',
							},
							{
								text: '25.12.3.2 A tabela file_instances',
								link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/03-performance-schema-instance-tables/02-the-file-instances-table.md',
							},
							{
								text: '25.12.3.3 A tabela mutex_instances',
								link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/03-performance-schema-instance-tables/03-the-mutex-instances-table.md',
							},
							{
								text: '25.12.3.4 A tabela rwlock_instances',
								link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/03-performance-schema-instance-tables/04-the-rwlock-instances-table.md',
							},
							{
								text: '25.12.3.5 A tabela socket_instances',
								link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/03-performance-schema-instance-tables/05-the-socket-instances-table.md',
							},
						],
						link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/03-performance-schema-instance-tables/index.md',
					},
					{
						text: '25.12.4 Tabelas de Eventos de Aguarda do Schema de Desempenho',
						collapsed: true,
						items: [
							{
								text: '25.12.4.1 A tabela events_waits_current',
								link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/04-performance-schema-wait-event-tables/01-the-events-waits-current-table.md',
							},
							{
								text: '25.12.4.2 A tabela events_waits_history',
								link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/04-performance-schema-wait-event-tables/02-the-events-waits-history-table.md',
							},
							{
								text: '25.12.4.3 A tabela events_waits_history_long',
								link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/04-performance-schema-wait-event-tables/03-the-events-waits-history-long-table.md',
							},
						],
						link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/04-performance-schema-wait-event-tables/index.md',
					},
					{
						text: '25.12.5 Tabelas de Eventos de Estágio do Schema de Desempenho',
						collapsed: true,
						items: [
							{
								text: '25.12.5.1 Tabela events_stages_current',
								link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/05-performance-schema-stage-event-tables/01-the-events-stages-current-table.md',
							},
							{
								text: '25.12.5.2 A tabela events_stages_history',
								link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/05-performance-schema-stage-event-tables/02-the-events-stages-history-table.md',
							},
							{
								text: '25.12.5.3 A tabela events_stages_history_long',
								link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/05-performance-schema-stage-event-tables/03-the-events-stages-history-long-table.md',
							},
						],
						link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/05-performance-schema-stage-event-tables/index.md',
					},
					{
						text: '25.12.6 Tabelas de Eventos da Declaração do Schema de Desempenho',
						collapsed: true,
						items: [
							{
								text: '25.12.6.1 A tabela events_statements_current',
								link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/06-performance-schema-statement-event-tables/01-the-events-statements-current-table.md',
							},
							{
								text: '25.12.6.2 A tabela events_statements_history',
								link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/06-performance-schema-statement-event-tables/02-the-events-statements-history-table.md',
							},
							{
								text: '25.12.6.3 A tabela events_statements_history_long',
								link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/06-performance-schema-statement-event-tables/03-the-events-statements-history-long-table.md',
							},
							{
								text: '25.12.6.4 A tabela prepared_statements_instances',
								link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/06-performance-schema-statement-event-tables/04-the-prepared-statements-instances-table.md',
							},
						],
						link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/06-performance-schema-statement-event-tables/index.md',
					},
					{
						text: '25.12.7 Tabelas de Transações do Schema de Desempenho',
						collapsed: true,
						items: [
							{
								text: '25.12.7.1 Tabela events_transactions_current',
								link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/07-performance-schema-transaction-tables/01-the-events-transactions-current-table.md',
							},
							{
								text: '25.12.7.2 A tabela events_transactions_history',
								link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/07-performance-schema-transaction-tables/02-the-events-transactions-history-table.md',
							},
							{
								text: '25.12.7.3 A tabela events_transactions_history_long',
								link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/07-performance-schema-transaction-tables/03-the-events-transactions-history-long-table.md',
							},
						],
						link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/07-performance-schema-transaction-tables/index.md',
					},
					{
						text: '25.12.8 Tabelas de Conexão do Schema de Desempenho',
						collapsed: true,
						items: [
							{
								text: '25.12.8.1 A tabela de contas',
								link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/08-performance-schema-connection-tables/01-the-accounts-table.md',
							},
							{
								text: '25.12.8.2 A tabela de anfitriões',
								link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/08-performance-schema-connection-tables/02-the-hosts-table.md',
							},
							{
								text: '25.12.8.3 A tabela de usuários',
								link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/08-performance-schema-connection-tables/03-the-users-table.md',
							},
						],
						link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/08-performance-schema-connection-tables/index.md',
					},
					{
						text: '25.12.9 Tabelas de atributos de conexão do esquema de desempenho',
						collapsed: true,
						items: [
							{
								text: '25.12.9.1 Tabela session_account_connect_attrs',
								link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/09-performance-schema-connection-attribute-tables/01-the-session-account-connect-attrs-table.md',
							},
							{
								text: '25.12.9.2 Tabela session_connect_attrs',
								link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/09-performance-schema-connection-attribute-tables/02-the-session-connect-attrs-table.md',
							},
						],
						link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/09-performance-schema-connection-attribute-tables/index.md',
					},
					{
						text: '25.12.11 Tabelas de Replicação do Schema de Desempenho',
						collapsed: true,
						items: [
							{
								text: '25.12.11.1 Tabela de configuração de conexão de replicação',
								link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/11-performance-schema-replication-tables/01-the-replication-connection-configuration-table.md',
							},
							{
								text: '25.12.11.2 Tabela replication_connection_status',
								link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/11-performance-schema-replication-tables/02-the-replication-connection-status-table.md',
							},
							{
								text: '25.12.11.3 A tabela replication_applier_configuration',
								link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/11-performance-schema-replication-tables/03-the-replication-applier-configuration-table.md',
							},
							{
								text: '25.12.11.4 A tabela replication_applier_status',
								link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/11-performance-schema-replication-tables/04-the-replication-applier-status-table.md',
							},
							{
								text: '25.12.11.5 Tabela replication_applier_status_by_coordinator',
								link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/11-performance-schema-replication-tables/05-the-replication-applier-status-by-coordinator-table.md',
							},
							{
								text: '25.12.11.6 Tabela replication_applier_status_by_worker',
								link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/11-performance-schema-replication-tables/06-the-replication-applier-status-by-worker-table.md',
							},
							{
								text: '25.12.11.7 Tabela replication_group_member_stats',
								link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/11-performance-schema-replication-tables/07-the-replication-group-member-stats-table.md',
							},
							{
								text: '25.12.11.8 A tabela replication_group_members',
								link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/11-performance-schema-replication-tables/08-the-replication-group-members-table.md',
							},
						],
						link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/11-performance-schema-replication-tables/index.md',
					},
					{
						text: '25.12.12 Tabelas de bloqueio do esquema de desempenho',
						collapsed: true,
						items: [
							{
								text: '25.12.12.1 Tabela metadata_locks',
								link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/12-performance-schema-lock-tables/01-the-metadata-locks-table.md',
							},
							{
								text: '25.12.12.2 A tabela_handles',
								link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/12-performance-schema-lock-tables/02-the-table-handles-table.md',
							},
						],
						link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/12-performance-schema-lock-tables/index.md',
					},
					{
						text: '25.12.15 Tabelas de Resumo do Schema de Desempenho',
						collapsed: true,
						items: [
							{
								text: '25.12.15.1 Tabelas de Resumo de Eventos de Aguardar',
								link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/15-performance-schema-summary-tables/01-wait-event-summary-tables.md',
							},
							{
								text: '25.12.15.2 Tabelas de Resumo das Fases',
								link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/15-performance-schema-summary-tables/02-stage-summary-tables.md',
							},
							{
								text: '25.12.15.3 Tabelas de Resumo das Declarações',
								link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/15-performance-schema-summary-tables/03-statement-summary-tables.md',
							},
							{
								text: '25.12.15.4 Tabelas de Resumo de Transações',
								link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/15-performance-schema-summary-tables/04-transaction-summary-tables.md',
							},
							{
								text: '25.12.15.5 Resumo da tabela de espera do objeto',
								link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/15-performance-schema-summary-tables/05-object-wait-summary-table.md',
							},
							{
								text: '25.12.15.6 Tabelas de Resumo de Entrada/Saída de Arquivos',
								link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/15-performance-schema-summary-tables/06-file-i-o-summary-tables.md',
							},
							{
								text: '25.12.15.7 Tabelas de Resumo de Temporização de Entrada/Saída e Bloqueio',
								link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/15-performance-schema-summary-tables/07-table-i-o-and-lock-wait-summary-tables.md',
							},
							{
								text: '25.12.15.8 Tabelas de Resumo de Soquetes',
								link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/15-performance-schema-summary-tables/08-socket-summary-tables.md',
							},
							{
								text: '25.12.15.9 Tabelas de Resumo de Memória',
								link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/15-performance-schema-summary-tables/09-memory-summary-tables.md',
							},
							{
								text: '25.12.15.10 Tabelas de Resumo de Estatísticas Variáveis do Status',
								link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/15-performance-schema-summary-tables/10-status-variable-summary-tables.md',
							},
						],
						link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/15-performance-schema-summary-tables/index.md',
					},
					{
						text: '25.12.16 Tabelas Diversas do Schema de Desempenho',
						collapsed: true,
						items: [
							{
								text: '25.12.16.1 Tabela host_cache',
								link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/16-performance-schema-miscellaneous-tables/01-the-host-cache-table.md',
							},
							{
								text: '25.12.16.2 Tabela performance_timers',
								link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/16-performance-schema-miscellaneous-tables/02-the-performance-timers-table.md',
							},
							{
								text: '25.12.16.3 A tabela Processo',
								link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/16-performance-schema-miscellaneous-tables/03-the-processlist-table.md',
							},
							{
								text: '25.12.16.4 A tabela de fios',
								link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/16-performance-schema-miscellaneous-tables/04-the-threads-table.md',
							},
						],
						link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/16-performance-schema-miscellaneous-tables/index.md',
					},
				],
				link: '/26-mysql-performance-schema/12-performance-schema-table-descriptions/index.md',
			},
			{
				text: '25.19 Usar o Schema de Desempenho para diagnosticar problemas',
				collapsed: true,
				items: [
					{
						text: '25.19.1 Análise de perfis de consulta usando o Gerenciamento de desempenho',
						link: '/26-mysql-performance-schema/19-using-the-performance-schema-to-diagnose-problems/01-query-profiling-using-performance-schema.md',
					},
				],
				link: '/26-mysql-performance-schema/19-using-the-performance-schema-to-diagnose-problems/index.md',
			},
		],
		link: '/26-mysql-performance-schema/index.md',
	},
	{
		text: 'Capítulo 26 Schema do sistema MySQL',
		collapsed: true,
		items: [
			{
				text: '26.1 Pré-requisitos para usar o esquema sys',
				link: '/27-mysql-sys-schema/01-prerequisites-for-using-the-sys-schema.md',
			},
			{
				text: '26.2 Usando o esquema sys',
				link: '/27-mysql-sys-schema/02-using-the-sys-schema.md',
			},
			{
				text: '26.3 Relatório de progresso do esquema do sistema',
				link: '/27-mysql-sys-schema/03-sys-schema-progress-reporting.md',
			},
			{
				text: '26.4 sys Objeto de esquema de referência',
				collapsed: true,
				items: [
					{
						text: '26.4.1 sys Schema Object Index',
						link: '/27-mysql-sys-schema/04-sys-schema-object-reference/01-sys-schema-object-index.md',
					},
					{
						text: '26.4.2 Tabelas e gatilhos do esquema sys',
						collapsed: true,
						items: [
							{
								text: '26.4.2.1 A Tabela sys_config',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/02-sys-schema-tables-and-triggers/01-the-sys-config-table.md',
							},
							{
								text: '26.4.2.2 O gatilho sys_config_insert_set_user',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/02-sys-schema-tables-and-triggers/02-the-sys-config-insert-set-user-trigger.md',
							},
							{
								text: '26.4.2.3 O gatilho sys_config_update_set_user',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/02-sys-schema-tables-and-triggers/03-the-sys-config-update-set-user-trigger.md',
							},
						],
						link: '/27-mysql-sys-schema/04-sys-schema-object-reference/02-sys-schema-tables-and-triggers/index.md',
					},
					{
						text: '26.4.3 Visões do esquema sys',
						collapsed: true,
						items: [
							{
								text: '26.4.3.1 As visualizações host_summary e x$host_summary',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/03-sys-schema-views/01-the-host-summary-and-x-host-summary-views.md',
							},
							{
								text: '26.4.3.2 As visualizações host_summary_by_file_io e x$host_summary_by_file_io',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/03-sys-schema-views/02-the-host-summary-by-file-io-and-x-host-summary-by-file-io-views.md',
							},
							{
								text: '26.4.3.3 As visualizações host_summary_by_file_io_type e x$host_summary_by_file_io_type',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/03-sys-schema-views/03-the-host-summary-by-file-io-type-and-x-host-summary-by-file-io-type-views.md',
							},
							{
								text: '26.4.3.4 As visualizações host_summary_by_stages e x$host_summary_by_stages',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/03-sys-schema-views/04-the-host-summary-by-stages-and-x-host-summary-by-stages-views.md',
							},
							{
								text: '26.4.3.5 As visualizações host_summary_by_statement_latency e x$host_summary_by_statement_latency',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/03-sys-schema-views/05-the-host-summary-by-statement-latency-and-x-host-summary-by-statement-latency-views.md',
							},
							{
								text: '26.4.3.6 As visualizações host_summary_by_statement_type e x$host_summary_by_statement_type',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/03-sys-schema-views/06-the-host-summary-by-statement-type-and-x-host-summary-by-statement-type-views.md',
							},
							{
								text: '26.4.3.7 As visualizações innodb_buffer_stats_by_schema e x$innodb_buffer_stats_by_schema',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/03-sys-schema-views/07-the-innodb-buffer-stats-by-schema-and-x-innodb-buffer-stats-by-schema-views.md',
							},
							{
								text: '26.4.3.8 As visualizações innodb_buffer_stats_by_table e x$innodb_buffer_stats_by_table',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/03-sys-schema-views/08-the-innodb-buffer-stats-by-table-and-x-innodb-buffer-stats-by-table-views.md',
							},
							{
								text: '26.4.3.9 As visualizações innodb_lock_waits e x$innodb_lock_waits',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/03-sys-schema-views/09-the-innodb-lock-waits-and-x-innodb-lock-waits-views.md',
							},
							{
								text: '26.4.3.10 As visualizações io_by_thread_by_latency e x$io_by_thread_by_latency',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/03-sys-schema-views/10-the-io-by-thread-by-latency-and-x-io-by-thread-by-latency-views.md',
							},
							{
								text: '26.4.3.11 As visualizações io_global_by_file_by_bytes e x$io_global_by_file_by_bytes',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/03-sys-schema-views/11-the-io-global-by-file-by-bytes-and-x-io-global-by-file-by-bytes-views.md',
							},
							{
								text: '26.4.3.12 As visualizações io_global_by_file_by_latency e x$io_global_by_file_by_latency',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/03-sys-schema-views/12-the-io-global-by-file-by-latency-and-x-io-global-by-file-by-latency-views.md',
							},
							{
								text: '26.4.3.13 As visualizações io_global_by_wait_by_bytes e x$io_global_by_wait_by_bytes',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/03-sys-schema-views/13-the-io-global-by-wait-by-bytes-and-x-io-global-by-wait-by-bytes-views.md',
							},
							{
								text: '26.4.3.14 As visualizações io_global_by_wait_by_latency e x$io_global_by_wait_by_latency',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/03-sys-schema-views/14-the-io-global-by-wait-by-latency-and-x-io-global-by-wait-by-latency-views.md',
							},
							{
								text: '26.4.3.15 As vistas latest_file_io e x$latest_file_io',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/03-sys-schema-views/15-the-latest-file-io-and-x-latest-file-io-views.md',
							},
							{
								text: '26.4.3.16 As visualizações memory_by_host_by_current_bytes e x$memory_by_host_by_current_bytes',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/03-sys-schema-views/16-the-memory-by-host-by-current-bytes-and-x-memory-by-host-by-current-bytes-views.md',
							},
							{
								text: '26.4.3.17 As visualizações memory_by_thread_by_current_bytes e x$memory_by_thread_by_current_bytes',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/03-sys-schema-views/17-the-memory-by-thread-by-current-bytes-and-x-memory-by-thread-by-current-bytes-views.md',
							},
							{
								text: '26.4.3.18 As visualizações memory_by_user_by_current_bytes e x$memory_by_user_by_current_bytes',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/03-sys-schema-views/18-the-memory-by-user-by-current-bytes-and-x-memory-by-user-by-current-bytes-views.md',
							},
							{
								text: '26.4.3.19 As visualizações memory_global_by_current_bytes e x$memory_global_by_current_bytes',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/03-sys-schema-views/19-the-memory-global-by-current-bytes-and-x-memory-global-by-current-bytes-views.md',
							},
							{
								text: '26.4.3.20 Visões de memory_global_total e x$memory_global_total',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/03-sys-schema-views/20-the-memory-global-total-and-x-memory-global-total-views.md',
							},
							{
								text: '26.4.3.21 As métricas Visualizar',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/03-sys-schema-views/21-the-metrics-view.md',
							},
							{
								text: '26.4.3.22 A lista de processos e as visualizações x$processlist',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/03-sys-schema-views/22-the-processlist-and-x-processlist-views.md',
							},
							{
								text: '26.4.3.23 A visualização ps_check_lost_instrumentation',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/03-sys-schema-views/23-the-ps-check-lost-instrumentation-view.md',
							},
							{
								text: '26.4.3.24 A visão schema_auto_increment_columns',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/03-sys-schema-views/24-the-schema-auto-increment-columns-view.md',
							},
							{
								text: '26.4.3.25 As visualizações schema_index_statistics e x$schema_index_statistics',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/03-sys-schema-views/25-the-schema-index-statistics-and-x-schema-index-statistics-views.md',
							},
							{
								text: '26.4.3.26 A visualização schema_object_overview',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/03-sys-schema-views/26-the-schema-object-overview-view.md',
							},
							{
								text: '26.4.3.27 As visualizações schema_redundant_indexes e x$schema_flattened_keys',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/03-sys-schema-views/27-the-schema-redundant-indexes-and-x-schema-flattened-keys-views.md',
							},
							{
								text: '26.4.3.28 As vistas schema_table_lock_waits e x$schema_table_lock_waits',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/03-sys-schema-views/28-the-schema-table-lock-waits-and-x-schema-table-lock-waits-views.md',
							},
							{
								text: '26.4.3.29 As visualizações schema_table_statistics e x$schema_table_statistics',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/03-sys-schema-views/29-the-schema-table-statistics-and-x-schema-table-statistics-views.md',
							},
							{
								text: '26.4.3.30 As visualizações schema_table_statistics_with_buffer e x$schema_table_statistics_with_buffer',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/03-sys-schema-views/30-the-schema-table-statistics-with-buffer-and-x-schema-table-statistics-with-buffer-views.md',
							},
							{
								text: '26.4.3.31 As vistas schema_tables_with_full_table_scans e x$schema_tables_with_full_table_scans',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/03-sys-schema-views/31-the-schema-tables-with-full-table-scans-and-x-schema-tables-with-full-table-scans-views.md',
							},
							{
								text: '26.4.3.32 A visão schema_unused_indexes',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/03-sys-schema-views/32-the-schema-unused-indexes-view.md',
							},
							{
								text: '26.4.3.33 A sessão e as visualizações da sessão x$',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/03-sys-schema-views/33-the-session-and-x-session-views.md',
							},
							{
								text: '26.4.3.34 A visualização session_ssl_status',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/03-sys-schema-views/34-the-session-ssl-status-view.md',
							},
							{
								text: '26.4.3.35 A análise da declaração e as visualizações x$statement_analysis',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/03-sys-schema-views/35-the-statement-analysis-and-x-statement-analysis-views.md',
							},
							{
								text: '26.4.3.36 As visualizações statements_with_errors_or_warnings e x$statements_with_errors_or_warnings',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/03-sys-schema-views/36-the-statements-with-errors-or-warnings-and-x-statements-with-errors-or-warnings-views.md',
							},
							{
								text: '26.4.3.37 As declarações com varreduras completas da tabela e as visualizações x$declarativas_com_varreduras_completos_da_tabela',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/03-sys-schema-views/37-the-statements-with-full-table-scans-and-x-statements-with-full-table-scans-views.md',
							},
							{
								text: '26.4.3.38 declarações_com_runtimes_no_95º percentil e x$declarações_com_runtimes_no_95º percentil Visualizações',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/03-sys-schema-views/38-the-statements-with-runtimes-in-95-th-percentile-and-x-statements-with-runtimes-in-95-th-percentile-v.md',
							},
							{
								text: '26.4.3.39 As visualizações _statements_with_sorting e x$statements_with_sorting',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/03-sys-schema-views/39-the-statements-with-sorting-and-x-statements-with-sorting-views.md',
							},
							{
								text: '26.4.3.40 As declarações com tabelas temporárias e as visualizações x$declarações com tabelas temporárias',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/03-sys-schema-views/40-the-statements-with-temp-tables-and-x-statements-with-temp-tables-views.md',
							},
							{
								text: '26.4.3.41 O resumo do usuário e as visualizações do resumo do usuário x$',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/03-sys-schema-views/41-the-user-summary-and-x-user-summary-views.md',
							},
							{
								text: '26.4.3.42 As visualizações user_summary_by_file_io e x$user_summary_by_file_io',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/03-sys-schema-views/42-the-user-summary-by-file-io-and-x-user-summary-by-file-io-views.md',
							},
							{
								text: '26.4.3.43 As visualizações user_summary_by_file_io_type e x$user_summary_by_file_io_type do usuário',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/03-sys-schema-views/43-the-user-summary-by-file-io-type-and-x-user-summary-by-file-io-type-views.md',
							},
							{
								text: '26.4.3.44 As visualizações user_summary_by_stages e x$user_summary_by_stages',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/03-sys-schema-views/44-the-user-summary-by-stages-and-x-user-summary-by-stages-views.md',
							},
							{
								text: '26.4.3.45 As visualizações user_summary_by_statement_latency e x$user_summary_by_statement_latency',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/03-sys-schema-views/45-the-user-summary-by-statement-latency-and-x-user-summary-by-statement-latency-views.md',
							},
							{
								text: '26.4.3.46 As visualizações user_summary_by_statement_type e x$user_summary_by_statement_type',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/03-sys-schema-views/46-the-user-summary-by-statement-type-and-x-user-summary-by-statement-type-views.md',
							},
							{
								text: '26.4.3.47 A versão Visualizar',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/03-sys-schema-views/47-the-version-view.md',
							},
							{
								text: '26.4.3.48 As visualizações wait_classes_global_by_avg_latency e x$wait_classes_global_by_avg_latency',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/03-sys-schema-views/48-the-wait-classes-global-by-avg-latency-and-x-wait-classes-global-by-avg-latency-views.md',
							},
							{
								text: '26.4.3.49 As visualizações wait_classes_global_by_latency e x$wait_classes_global_by_latency',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/03-sys-schema-views/49-the-wait-classes-global-by-latency-and-x-wait-classes-global-by-latency-views.md',
							},
							{
								text: '26.4.3.50 As visualizações waits_by_host_by_latency e x$waits_by_host_by_latency',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/03-sys-schema-views/50-the-waits-by-host-by-latency-and-x-waits-by-host-by-latency-views.md',
							},
							{
								text: '26.4.3.51 As visualizações waits_by_user_by_latency e x$waits_by_user_by_latency',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/03-sys-schema-views/51-the-waits-by-user-by-latency-and-x-waits-by-user-by-latency-views.md',
							},
							{
								text: '26.4.3.52 As visualizações waits_global_by_latency e x$waits_global_by_latency',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/03-sys-schema-views/52-the-waits-global-by-latency-and-x-waits-global-by-latency-views.md',
							},
						],
						link: '/27-mysql-sys-schema/04-sys-schema-object-reference/03-sys-schema-views/index.md',
					},
					{
						text: '26.4.4 Procedimentos armazenados do esquema sys',
						collapsed: true,
						items: [
							{
								text: '26.4.4.1 O procedimento create_synonym_db()',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/04-sys-schema-stored-procedures/01-the-create-synonym-db-procedure.md',
							},
							{
								text: '26.4.4.2 O procedimento diagnostics()',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/04-sys-schema-stored-procedures/02-the-diagnostics-procedure.md',
							},
							{
								text: '26.4.4.3 O procedimento execute_prepared_stmt()',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/04-sys-schema-stored-procedures/03-the-execute-prepared-stmt-procedure.md',
							},
							{
								text: '26.4.4.4 O procedimento ps_setup_disable_background_threads()',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/04-sys-schema-stored-procedures/04-the-ps-setup-disable-background-threads-procedure.md',
							},
							{
								text: '26.4.4.5 O procedimento ps_setup_disable_consumer()',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/04-sys-schema-stored-procedures/05-the-ps-setup-disable-consumer-procedure.md',
							},
							{
								text: '26.4.4.6 O procedimento ps_setup_disable_instrument()',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/04-sys-schema-stored-procedures/06-the-ps-setup-disable-instrument-procedure.md',
							},
							{
								text: '26.4.4.7 O procedimento ps_setup_disable_thread()',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/04-sys-schema-stored-procedures/07-the-ps-setup-disable-thread-procedure.md',
							},
							{
								text: '26.4.4.8 O procedimento ps_setup_enable_background_threads()',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/04-sys-schema-stored-procedures/08-the-ps-setup-enable-background-threads-procedure.md',
							},
							{
								text: '26.4.4.9 O procedimento ps_setup_enable_consumer()',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/04-sys-schema-stored-procedures/09-the-ps-setup-enable-consumer-procedure.md',
							},
							{
								text: '26.4.4.10 O procedimento ps_setup_enable_instrument()',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/04-sys-schema-stored-procedures/10-the-ps-setup-enable-instrument-procedure.md',
							},
							{
								text: '26.4.4.11 O procedimento ps_setup_enable_thread()',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/04-sys-schema-stored-procedures/11-the-ps-setup-enable-thread-procedure.md',
							},
							{
								text: '26.4.4.12 O procedimento ps_setup_reload_saved()',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/04-sys-schema-stored-procedures/12-the-ps-setup-reload-saved-procedure.md',
							},
							{
								text: '26.4.4.13 O procedimento ps_setup_reset_to_default()',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/04-sys-schema-stored-procedures/13-the-ps-setup-reset-to-default-procedure.md',
							},
							{
								text: '26.4.4.14 O procedimento ps_setup_save()',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/04-sys-schema-stored-procedures/14-the-ps-setup-save-procedure.md',
							},
							{
								text: '26.4.4.15 O procedimento ps_setup_show_disabled()',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/04-sys-schema-stored-procedures/15-the-ps-setup-show-disabled-procedure.md',
							},
							{
								text: '26.4.4.16 O procedimento ps_setup_show_disabled_consumers()',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/04-sys-schema-stored-procedures/16-the-ps-setup-show-disabled-consumers-procedure.md',
							},
							{
								text: '26.4.4.17 O procedimento ps_setup_show_disabled_instruments()',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/04-sys-schema-stored-procedures/17-the-ps-setup-show-disabled-instruments-procedure.md',
							},
							{
								text: '26.4.4.18 O procedimento ps_setup_show_enabled()',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/04-sys-schema-stored-procedures/18-the-ps-setup-show-enabled-procedure.md',
							},
							{
								text: '26.4.4.19 O procedimento ps_setup_show_enabled_consumers()',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/04-sys-schema-stored-procedures/19-the-ps-setup-show-enabled-consumers-procedure.md',
							},
							{
								text: '26.4.4.20 O procedimento ps_setup_show_enabled_instruments()',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/04-sys-schema-stored-procedures/20-the-ps-setup-show-enabled-instruments-procedure.md',
							},
							{
								text: '26.4.4.21 O procedimento ps_statement_avg_latency_histogram()',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/04-sys-schema-stored-procedures/21-the-ps-statement-avg-latency-histogram-procedure.md',
							},
							{
								text: '26.4.4.22 O procedimento ps_trace_statement_digest()',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/04-sys-schema-stored-procedures/22-the-ps-trace-statement-digest-procedure.md',
							},
							{
								text: '26.4.4.23 O procedimento ps_trace_thread()',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/04-sys-schema-stored-procedures/23-the-ps-trace-thread-procedure.md',
							},
							{
								text: '26.4.4.24 O procedimento ps_truncate_all_tables()',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/04-sys-schema-stored-procedures/24-the-ps-truncate-all-tables-procedure.md',
							},
							{
								text: '26.4.4.25 Procedimento statement_performance_analyzer()',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/04-sys-schema-stored-procedures/25-the-statement-performance-analyzer-procedure.md',
							},
							{
								text: '26.4.4.26 Procedimento table_exists()',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/04-sys-schema-stored-procedures/26-the-table-exists-procedure.md',
							},
						],
						link: '/27-mysql-sys-schema/04-sys-schema-object-reference/04-sys-schema-stored-procedures/index.md',
					},
					{
						text: '26.4.5 Funções Armazenadas no Schema sys',
						collapsed: true,
						items: [
							{
								text: '26.4.5.1 A função extract_schema_from_file_name()',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/05-sys-schema-stored-functions/01-the-extract-schema-from-file-name-function.md',
							},
							{
								text: '26.4.5.2 A função extract_table_from_file_name()',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/05-sys-schema-stored-functions/02-the-extract-table-from-file-name-function.md',
							},
							{
								text: '26.4.5.3 A função format_bytes()',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/05-sys-schema-stored-functions/03-the-format-bytes-function.md',
							},
							{
								text: '26.4.5.4 A função format_path()',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/05-sys-schema-stored-functions/04-the-format-path-function.md',
							},
							{
								text: '26.4.5.5 A função format_statement()',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/05-sys-schema-stored-functions/05-the-format-statement-function.md',
							},
							{
								text: '26.4.5.6 A função format_time()',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/05-sys-schema-stored-functions/06-the-format-time-function.md',
							},
							{
								text: '26.4.5.7 A função list_add()',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/05-sys-schema-stored-functions/07-the-list-add-function.md',
							},
							{
								text: '26.4.5.8 A função list_drop()',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/05-sys-schema-stored-functions/08-the-list-drop-function.md',
							},
							{
								text: '26.4.5.9 A função ps_is_account_enabled()',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/05-sys-schema-stored-functions/09-the-ps-is-account-enabled-function.md',
							},
							{
								text: '26.4.5.10 A função ps_is_consumer_enabled()',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/05-sys-schema-stored-functions/10-the-ps-is-consumer-enabled-function.md',
							},
							{
								text: '26.4.5.11 A função ps_is_instrument_default_enabled()',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/05-sys-schema-stored-functions/11-the-ps-is-instrument-default-enabled-function.md',
							},
							{
								text: '26.4.5.12 A função ps_is_instrument_default_timed()',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/05-sys-schema-stored-functions/12-the-ps-is-instrument-default-timed-function.md',
							},
							{
								text: '26.4.5.13 A função ps_is_thread_instrumented()',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/05-sys-schema-stored-functions/13-the-ps-is-thread-instrumented-function.md',
							},
							{
								text: '26.4.5.14 A função ps_thread_account()',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/05-sys-schema-stored-functions/14-the-ps-thread-account-function.md',
							},
							{
								text: '26.4.5.15 A função ps_thread_id()',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/05-sys-schema-stored-functions/15-the-ps-thread-id-function.md',
							},
							{
								text: '26.4.5.16 A função ps_thread_stack()',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/05-sys-schema-stored-functions/16-the-ps-thread-stack-function.md',
							},
							{
								text: '26.4.5.17 A função ps_thread_trx_info()',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/05-sys-schema-stored-functions/17-the-ps-thread-trx-info-function.md',
							},
							{
								text: '26.4.5.18 A função quote_identifier()',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/05-sys-schema-stored-functions/18-the-quote-identifier-function.md',
							},
							{
								text: '26.4.5.19 A função sys_get_config()',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/05-sys-schema-stored-functions/19-the-sys-get-config-function.md',
							},
							{
								text: '26.4.5.20 A função version_major()',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/05-sys-schema-stored-functions/20-the-version-major-function.md',
							},
							{
								text: '26.4.5.21 A função version_minor()',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/05-sys-schema-stored-functions/21-the-version-minor-function.md',
							},
							{
								text: '26.4.5.22 A função version_patch()',
								link: '/27-mysql-sys-schema/04-sys-schema-object-reference/05-sys-schema-stored-functions/22-the-version-patch-function.md',
							},
						],
						link: '/27-mysql-sys-schema/04-sys-schema-object-reference/05-sys-schema-stored-functions/index.md',
					},
				],
				link: '/27-mysql-sys-schema/04-sys-schema-object-reference/index.md',
			},
		],
		link: '/27-mysql-sys-schema/index.md',
	},
	{
		text: 'Capítulo 27 Conectores e APIs',
		collapsed: true,
		items: [
			{
				text: '27.1 MySQL Connector/C++',
				link: '/28-connectors-and-apis/01-my-s-q-l-connector-c.md',
			},
			{
				text: '27.2 MySQL Connector/J',
				link: '/28-connectors-and-apis/02-my-s-q-l-connector-j.md',
			},
			{
				text: '27.3 MySQL Connector/NET',
				link: '/28-connectors-and-apis/03-my-s-q-l-connector-net.md',
			},
			{
				text: '27.4 MySQL Connector/ODBC',
				link: '/28-connectors-and-apis/04-my-s-q-l-connector-odbc.md',
			},
			{
				text: '27.5 MySQL Connector/Python',
				link: '/28-connectors-and-apis/05-my-s-q-l-connector-python.md',
			},
			{
				text: '27.7 API C para MySQL',
				link: '/28-connectors-and-apis/07-my-s-q-l-c-api.md',
			},
			{
				text: '27.8 API MySQL PHP',
				link: '/28-connectors-and-apis/08-my-s-q-l-p-h-p-api.md',
			},
			{
				text: '27.9 API MySQL Perl',
				link: '/28-connectors-and-apis/09-my-s-q-l-perl-api.md',
			},
			{
				text: '27.10 API Python do MySQL',
				link: '/28-connectors-and-apis/10-my-s-q-l-python-api.md',
			},
			{
				text: '27.12 API Tcl para MySQL',
				link: '/28-connectors-and-apis/12-my-s-q-l-tcl-api.md',
			},
			{
				text: '27.13 MySQL Eiffel Wrapper',
				link: '/28-connectors-and-apis/13-my-s-q-l-eiffel-wrapper.md',
			},
			{
				text: '27.6 libmysqld, a Biblioteca do Servidor MySQL Integrado',
				collapsed: true,
				items: [
					{
						text: '27.6.1 Compilando programas com o libmysqld',
						link: '/28-connectors-and-apis/06-libmysqld-the-embedded-my-s-q-l-server-library/01-compiling-programs-with-libmysqld.md',
					},
					{
						text: '27.6.2 Restrições ao usar o servidor MySQL integrado',
						link: '/28-connectors-and-apis/06-libmysqld-the-embedded-my-s-q-l-server-library/02-restrictions-when-using-the-embedded-my-s-q-l-server.md',
					},
					{
						text: '27.6.3 Opções com o Servidor Integrado',
						link: '/28-connectors-and-apis/06-libmysqld-the-embedded-my-s-q-l-server-library/03-options-with-the-embedded-server.md',
					},
					{
						text: '27.6.4 Exemplos de Servidor Integrado',
						link: '/28-connectors-and-apis/06-libmysqld-the-embedded-my-s-q-l-server-library/04-embedded-server-examples.md',
					},
				],
				link: '/28-connectors-and-apis/06-libmysqld-the-embedded-my-s-q-l-server-library/index.md',
			},
			{
				text: '27.11 APIs Ruby do MySQL',
				collapsed: true,
				items: [
					{
						text: '27.11.1 API MySQL/Ruby',
						link: '/28-connectors-and-apis/11-my-s-q-l-ruby-ap-is/01-the-my-sql-ruby-api.md',
					},
					{
						text: '27.11.1 API Ruby/MySQL',
						link: '/28-connectors-and-apis/11-my-s-q-l-ruby-ap-is/02-the-ruby-my-s-q-l-api.md',
					},
				],
				link: '/28-connectors-and-apis/11-my-s-q-l-ruby-ap-is/index.md',
			},
		],
		link: '/28-connectors-and-apis/index.md',
	},
	{
		text: 'Capítulo 28 MySQL Enterprise Edition',
		collapsed: true,
		items: [
			{
				text: '28.1 Visão geral do backup do MySQL Enterprise',
				link: '/29-mysql-enterprise-edition/01-my-s-q-l-enterprise-backup-overview.md',
			},
			{
				text: '28.2 Visão geral da segurança empresarial do MySQL',
				link: '/29-mysql-enterprise-edition/02-my-s-q-l-enterprise-security-overview.md',
			},
			{
				text: '28.3 Visão geral da criptografia empresarial do MySQL',
				link: '/29-mysql-enterprise-edition/03-my-s-q-l-enterprise-encryption-overview.md',
			},
			{
				text: '28.4 Visão geral de auditoria do MySQL Enterprise',
				link: '/29-mysql-enterprise-edition/04-my-s-q-l-enterprise-audit-overview.md',
			},
			{
				text: '28.5 Visão geral do Firewall Empresarial MySQL',
				link: '/29-mysql-enterprise-edition/05-my-s-q-l-enterprise-firewall-overview.md',
			},
			{
				text: '28.6 Visão geral do Pool de Fios do MySQL Enterprise',
				link: '/29-mysql-enterprise-edition/06-my-s-q-l-enterprise-thread-pool-overview.md',
			},
			{
				text: '28.7 Visão geral da Máscara de dados e desidentificação da MySQL Enterprise',
				link: '/29-mysql-enterprise-edition/07-my-s-q-l-enterprise-data-masking-and-de-identification-overview.md',
			},
			{
				text: '28.8 Visão geral do Monitoramento Empresarial do MySQL',
				link: '/29-mysql-enterprise-edition/08-my-s-q-l-enterprise-monitor-overview.md',
			},
			{
				text: '28.9 Telemetria do MySQL',
				link: '/29-mysql-enterprise-edition/09-my-s-q-l-telemetry.md',
			},
		],
		link: '/29-mysql-enterprise-edition/index.md',
	},
  	{
		text: 'Capítulo 29 MySQL Workbench',
		link: '/30-mysql-workbench.md',
	},
	{
		text: 'Apêndice A Perguntas Frequentes sobre o MySQL 5.7',
		collapsed: true,
		items: [
			{
				text: 'A.1 Perguntas frequentes sobre o MySQL 5.7: Geral',
				link: '/31-mysql-57-frequently-asked-questions/01-my-s-q-l-5-7-f-a-q-general.md',
			},
			{
				text: 'A.2 Perguntas frequentes sobre o MySQL 5.7: Motores de armazenamento',
				link: '/31-mysql-57-frequently-asked-questions/02-my-s-q-l-5-7-f-a-q-storage-engines.md',
			},
			{
				text: 'A.3 Perguntas frequentes sobre o MySQL 5.7: Modo SQL do servidor',
				link: '/31-mysql-57-frequently-asked-questions/03-my-s-q-l-5-7-f-a-q-server-s-q-l-mode.md',
			},
			{
				text: 'A.4 Perguntas frequentes sobre o MySQL 5.7: Procedimentos e funções armazenadas',
				link: '/31-mysql-57-frequently-asked-questions/04-my-s-q-l-5-7-f-a-q-stored-procedures-and-functions.md',
			},
			{
				text: 'A.5 Perguntas frequentes sobre o MySQL 5.7: gatilhos',
				link: '/31-mysql-57-frequently-asked-questions/05-my-s-q-l-5-7-f-a-q-triggers.md',
			},
			{
				text: 'A.6 Perguntas frequentes sobre o MySQL 5.7: Visualizações',
				link: '/31-mysql-57-frequently-asked-questions/06-my-s-q-l-5-7-f-a-q-views.md',
			},
			{
				text: 'A.7 Perguntas frequentes sobre o MySQL 5.7: INFORMATION_SCHEMA',
				link: '/31-mysql-57-frequently-asked-questions/07-my-s-q-l-5-7-f-a-q-i-n-f-o-r-m-a-t-i-o-n-schema.md',
			},
			{
				text: 'A.8 Perguntas frequentes sobre o MySQL 5.7: Migração',
				link: '/31-mysql-57-frequently-asked-questions/08-my-s-q-l-5-7-f-a-q-migration.md',
			},
			{
				text: 'A.9 Perguntas frequentes sobre o MySQL 5.7: Segurança',
				link: '/31-mysql-57-frequently-asked-questions/09-my-s-q-l-5-7-f-a-q-security.md',
			},
			{
				text: 'A.10 Perguntas frequentes sobre o MySQL 5.7: NDB Cluster',
				link: '/31-mysql-57-frequently-asked-questions/10-my-s-q-l-5-7-f-a-q-n-d-b-cluster.md',
			},
			{
				text: 'A.11 Perguntas frequentes sobre o MySQL 5.7: conjuntos de caracteres chineses, japoneses e coreanos do MySQL',
				link: '/31-mysql-57-frequently-asked-questions/11-my-s-q-l-5-7-f-a-q-my-s-q-l-chinese-japanese-and-korean-character-sets.md',
			},
			{
				text: 'A.12 Perguntas frequentes sobre o MySQL 5.7: Conectores e APIs',
				link: '/31-mysql-57-frequently-asked-questions/12-my-s-q-l-5-7-f-a-q-connectors-ap-is.md',
			},
			{
				text: 'A.13 Perguntas frequentes sobre o MySQL 5.7: API C, libmysql',
				link: '/31-mysql-57-frequently-asked-questions/13-my-s-q-l-5-7-f-a-q-c-api-libmysql.md',
			},
			{
				text: 'A.14 Perguntas frequentes sobre o MySQL 5.7: Replicação',
				link: '/31-mysql-57-frequently-asked-questions/14-my-s-q-l-5-7-f-a-q-replication.md',
			},
			{
				text: 'A.15 Perguntas frequentes sobre o MySQL 5.7: Pool de threads do MySQL Enterprise',
				link: '/31-mysql-57-frequently-asked-questions/15-my-s-q-l-5-7-f-a-q-my-s-q-l-enterprise-thread-pool.md',
			},
			{
				text: 'A.16 Perguntas frequentes sobre o MySQL 5.7: Buffer de alteração InnoDB',
				link: '/31-mysql-57-frequently-asked-questions/16-my-s-q-l-5-7-f-a-q-inno-d-b-change-buffer.md',
			},
			{
				text: 'A.17 Perguntas frequentes sobre o MySQL 5.7: Criptografia de dados em repouso do InnoDB',
				link: '/31-mysql-57-frequently-asked-questions/17-my-s-q-l-5-7-f-a-q-inno-d-b-data-at-rest-encryption.md',
			},
			{
				text: 'A.18 Perguntas frequentes sobre o MySQL 5.7: Suporte à virtualização',
				link: '/31-mysql-57-frequently-asked-questions/18-my-s-q-l-5-7-f-a-q-virtualization-support.md',
			},
		],
		link: '/31-mysql-57-frequently-asked-questions/index.md',
	},
	{
		text: 'Apêndice B Mensagens de erro e problemas comuns',
		collapsed: true,
		items: [
			{
				text: 'B.1 Fontes e elementos dos erros de mensagem',
				link: '/32-error-messages-and-common-problems/01-error-message-sources-and-elements.md',
			},
			{
				text: 'B.2 Interfaces de informações de erro',
				link: '/32-error-messages-and-common-problems/02-error-information-interfaces.md',
			},
			{
				text: 'B.3 Problemas e Erros Comuns',
				collapsed: true,
				items: [
					{
						text: 'B.3.1 Como determinar o que está causando um problema',
						link: '/32-error-messages-and-common-problems/03-problems-and-common-errors/01-how-to-determine-what-is-causing-a-problem.md',
					},
					{
						text: 'B.3.5 Problemas relacionados ao otimizador',
						link: '/32-error-messages-and-common-problems/03-problems-and-common-errors/05-optimizer-related-issues.md',
					},
					{
						text: 'B.3.7 Problemas Conhecidos no MySQL',
						link: '/32-error-messages-and-common-problems/03-problems-and-common-errors/07-known-issues-in-my-sql.md',
					},
					{
						text: 'B.3.2 Erros Comuns ao Usar Programas MySQL',
						collapsed: true,
						items: [
							{
								text: 'B.3.2.1 Acesso negado',
								link: '/32-error-messages-and-common-problems/03-problems-and-common-errors/02-common-errors-when-using-my-s-q-l-programs/01-access-denied.md',
							},
							{
								text: 'B.3.2.2 Não consigo me conectar ao servidor MySQL [local]',
								link: '/32-error-messages-and-common-problems/03-problems-and-common-errors/02-common-errors-when-using-my-s-q-l-programs/02-can-t-connect-to-local-my-s-q-l-server.md',
							},
							{
								text: 'B.3.2.3 Conexão perdida com o servidor MySQL',
								link: '/32-error-messages-and-common-problems/03-problems-and-common-errors/02-common-errors-when-using-my-s-q-l-programs/03-lost-connection-to-my-s-q-l-server.md',
							},
							{
								text: 'B.3.2.4 Senha falha quando inserida interativamente',
								link: '/32-error-messages-and-common-problems/03-problems-and-common-errors/02-common-errors-when-using-my-s-q-l-programs/04-password-fails-when-entered-interactively.md',
							},
							{
								text: 'B.3.2.5 Muitas conexões',
								link: '/32-error-messages-and-common-problems/03-problems-and-common-errors/02-common-errors-when-using-my-s-q-l-programs/05-too-many-connections.md',
							},
							{
								text: 'B.3.2.6 Sem memória',
								link: '/32-error-messages-and-common-problems/03-problems-and-common-errors/02-common-errors-when-using-my-s-q-l-programs/06-out-of-memory.md',
							},
							{
								text: 'B.3.2.7 O servidor MySQL desapareceu',
								link: '/32-error-messages-and-common-problems/03-problems-and-common-errors/02-common-errors-when-using-my-s-q-l-programs/07-my-s-q-l-server-has-gone-away.md',
							},
							{
								text: 'B.3.2.8 Pacote muito grande',
								link: '/32-error-messages-and-common-problems/03-problems-and-common-errors/02-common-errors-when-using-my-s-q-l-programs/08-packet-too-large.md',
							},
							{
								text: 'B.3.2.9 Erros de comunicação e conexões interrompidas',
								link: '/32-error-messages-and-common-problems/03-problems-and-common-errors/02-common-errors-when-using-my-s-q-l-programs/09-communication-errors-and-aborted-connections.md',
							},
							{
								text: 'B.3.2.10 A mesa está cheia',
								link: '/32-error-messages-and-common-problems/03-problems-and-common-errors/02-common-errors-when-using-my-s-q-l-programs/10-the-table-is-full.md',
							},
							{
								text: 'B.3.2.11 Não é possível criar/escrever no arquivo',
								link: '/32-error-messages-and-common-problems/03-problems-and-common-errors/02-common-errors-when-using-my-s-q-l-programs/11-can-t-createwrite-to-file.md',
							},
							{
								text: 'B.3.2.12 Comandos fora de sincronia',
								link: '/32-error-messages-and-common-problems/03-problems-and-common-errors/02-common-errors-when-using-my-s-q-l-programs/12-commands-out-of-sync.md',
							},
							{
								text: 'B.3.2.13 Ignorar o usuário',
								link: '/32-error-messages-and-common-problems/03-problems-and-common-errors/02-common-errors-when-using-my-s-q-l-programs/13-ignoring-user.md',
							},
							{
								text: 'B.3.2.14 A tabela \'tbl_name\' não existe',
								link: '/32-error-messages-and-common-problems/03-problems-and-common-errors/02-common-errors-when-using-my-s-q-l-programs/14-table-tbl-name-doesn-t-exist.md',
							},
							{
								text: 'B.3.2.15 Não é possível inicializar o conjunto de caracteres',
								link: '/32-error-messages-and-common-problems/03-problems-and-common-errors/02-common-errors-when-using-my-s-q-l-programs/15-can-t-initialize-character-set.md',
							},
							{
								text: 'B.3.2.16 Arquivo não encontrado e erros semelhantes',
								link: '/32-error-messages-and-common-problems/03-problems-and-common-errors/02-common-errors-when-using-my-s-q-l-programs/16-file-not-found-and-similar-errors.md',
							},
							{
								text: 'B.3.2.17 Problemas de corrupção de tabela',
								link: '/32-error-messages-and-common-problems/03-problems-and-common-errors/02-common-errors-when-using-my-s-q-l-programs/17-table-corruption-issues.md',
							},
						],
						link: '/32-error-messages-and-common-problems/03-problems-and-common-errors/02-common-errors-when-using-my-s-q-l-programs/index.md',
					},
					{
						text: 'B.3.3 Questões relacionadas à administração',
						collapsed: true,
						items: [
							{
								text: 'B.3.3.1 Problemas com permissões de arquivo',
								link: '/32-error-messages-and-common-problems/03-problems-and-common-errors/03-administration-related-issues/01-problems-with-file-permissions.md',
							},
							{
								text: 'B.3.3.2 Como redefinir a senha de root',
								link: '/32-error-messages-and-common-problems/03-problems-and-common-errors/03-administration-related-issues/02-how-to-reset-the-root-password.md',
							},
							{
								text: 'B.3.3.3 O que fazer se o MySQL continuar a falhar',
								link: '/32-error-messages-and-common-problems/03-problems-and-common-errors/03-administration-related-issues/03-what-to-do-if-my-s-q-l-keeps-crashing.md',
							},
							{
								text: 'B.3.3.4 Como o MySQL lida com um disco inteiro',
								link: '/32-error-messages-and-common-problems/03-problems-and-common-errors/03-administration-related-issues/04-how-my-s-q-l-handles-a-full-disk.md',
							},
							{
								text: 'B.3.3.5 Onde o MySQL armazena arquivos temporários',
								link: '/32-error-messages-and-common-problems/03-problems-and-common-errors/03-administration-related-issues/05-where-my-s-q-l-stores-temporary-files.md',
							},
							{
								text: 'B.3.3.6 Como proteger ou alterar o arquivo de soquete Unix do MySQL',
								link: '/32-error-messages-and-common-problems/03-problems-and-common-errors/03-administration-related-issues/06-how-to-protect-or-change-the-my-s-q-l-unix-socket-file.md',
							},
							{
								text: 'B.3.3.7 Problemas com fuso horário',
								link: '/32-error-messages-and-common-problems/03-problems-and-common-errors/03-administration-related-issues/07-time-zone-problems.md',
							},
						],
						link: '/32-error-messages-and-common-problems/03-problems-and-common-errors/03-administration-related-issues/index.md',
					},
					{
						text: 'B.3.4 Questões relacionadas a consultas',
						collapsed: true,
						items: [
							{
								text: 'B.3.4.1 Sensibilidade à maiúscula e minúscula nas pesquisas de strings',
								link: '/32-error-messages-and-common-problems/03-problems-and-common-errors/04-query-related-issues/01-case-sensitivity-in-string-searches.md',
							},
							{
								text: 'B.3.4.2 Problemas ao usar colunas DATE',
								link: '/32-error-messages-and-common-problems/03-problems-and-common-errors/04-query-related-issues/02-problems-using-d-a-t-e-columns.md',
							},
							{
								text: 'B.3.4.3 Problemas com valores nulos',
								link: '/32-error-messages-and-common-problems/03-problems-and-common-errors/04-query-related-issues/03-problems-with-n-u-l-l-values.md',
							},
							{
								text: 'B.3.4.4 Problemas com aliases de colunas',
								link: '/32-error-messages-and-common-problems/03-problems-and-common-errors/04-query-related-issues/04-problems-with-column-aliases.md',
							},
							{
								text: 'B.3.4.5 Falha no rollback para tabelas não transacionais',
								link: '/32-error-messages-and-common-problems/03-problems-and-common-errors/04-query-related-issues/05-rollback-failure-for-nontransactional-tables.md',
							},
							{
								text: 'B.3.4.6 Excluindo Linhas de Tabelas Relacionadas',
								link: '/32-error-messages-and-common-problems/03-problems-and-common-errors/04-query-related-issues/06-deleting-rows-from-related-tables.md',
							},
							{
								text: 'B.3.4.7 Resolver problemas sem linhas correspondentes',
								link: '/32-error-messages-and-common-problems/03-problems-and-common-errors/04-query-related-issues/07-solving-problems-with-no-matching-rows.md',
							},
							{
								text: 'B.3.4.8 Problemas com valores de ponto flutuante',
								link: '/32-error-messages-and-common-problems/03-problems-and-common-errors/04-query-related-issues/08-problems-with-floating-point-values.md',
							},
						],
						link: '/32-error-messages-and-common-problems/03-problems-and-common-errors/04-query-related-issues/index.md',
					},
					{
						text: 'B.3.6 Questões relacionadas à definição de tabelas',
						collapsed: true,
						items: [
							{
								text: 'B.3.6.1 Problemas com ALTER TABLE',
								link: '/32-error-messages-and-common-problems/03-problems-and-common-errors/06-table-definition-related-issues/01-problems-with-a-l-t-e-r-table.md',
							},
							{
								text: 'B.3.6.2 Problemas com a Tabela TEMPORARY',
								link: '/32-error-messages-and-common-problems/03-problems-and-common-errors/06-table-definition-related-issues/02-t-e-m-p-o-r-a-r-y-table-problems.md',
							},
						],
						link: '/32-error-messages-and-common-problems/03-problems-and-common-errors/06-table-definition-related-issues/index.md',
					},
				],
				link: '/32-error-messages-and-common-problems/03-problems-and-common-errors/index.md',
			},
		],
		link: '/32-error-messages-and-common-problems/index.md',
	},
	{
		text: 'Apêndice C: Índices',
		collapsed: true,
		items: [
			{
				text: 'Índice Geral',
				link: '/33-indexes/01-general-index.md',
			},
			{
				text: 'Índice de Função C',
				link: '/33-indexes/02-function-index.md',
			},
			{
				text: 'Índice de comandos',
				link: '/33-indexes/03-command-index.md',
			},
			{
				text: 'Índice de Funções',
				link: '/33-indexes/04-function-index.md',
			},
			{
				text: 'SCHEMA_INFORMATION Índice',
				link: '/33-indexes/05-i-n-f-o-r-m-a-t-i-o-n-s-c-h-e-m-a-index.md',
			},
			{
				text: 'Acesse o Índice de Tipos',
				link: '/33-indexes/06-join-types-index.md',
			},
			{
				text: 'Índice de Operadores',
				link: '/33-indexes/07-operator-index.md',
			},
			{
				text: 'Índice de Opções',
				link: '/33-indexes/08-option-index.md',
			},
			{
				text: 'Índice de privilégios',
				link: '/33-indexes/09-privileges-index.md',
			},
			{
				text: 'Índice de modos SQL',
				link: '/33-indexes/10-modes-index.md',
			},
			{
				text: 'Índice de Declarações/Sintaxe',
				link: '/33-indexes/11-statement-syntax-index.md',
			},
			{
				text: 'Índice de Índice Variável de Status',
				link: '/33-indexes/12-status-variable-index.md',
			},
			{
				text: 'Índice de Variável do Sistema',
				link: '/33-indexes/13-system-variable-index.md',
			},
			{
				text: 'Índice de Nível de Isolamento de Transação',
				link: '/33-indexes/14-transaction-isolation-level-index.md',
			},
		],
		link: '/33-indexes/index.md',
	},
  	{
		text: 'Glossário do MySQL',
		link: '/34-mysql-glossary.md',
	},
]
