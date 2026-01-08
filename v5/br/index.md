# MySQL 5.x

## Sumário

* [Prefácio e Avisos Legais](/01-preface-and-legal-notices.md)
* [Geral](v5/br/02-general-information/index.md)
	* [Informações gerais](/02-general-information/index.md)
	* [Sobre este manual](/02-general-information/01-about-this-manual.md)	
		* [Visão geral do sistema de gerenciamento de banco de dados MySQL](/02-general-information/02-overview-of-the-mysql-database-management-system/index.md),
      * [O que é o MySQL?](/02-general-information/02-overview-of-the-mysql-database-management-system/01-whats-is-my-sql.md)
      * [Principais características do MySQL](/02-general-information/02-overview-of-the-mysql-database-management-system/02-the-main-features-of-my-sql.md)
      * [História do MySQL](/02-general-information/02-overview-of-the-mysql-database-management-system/03-history-of-my-sql.md)
    * [O que há de novo no MySQL 5.7](/02-general-information/03-what-is-new-in-mysql-57.md)
  	* [Variáveis e opções de servidor e status adicionadas, descontinuadas ou removidas no MySQL 5.7](/02-general-information/04-server-and-status-variables.md)
    * [Como relatar bugs ou problemas](/02-general-information/05-how-to-report-bugs-or-problems.md)
    * [Conformidade com os Padrões MySQL](/02-general-information/06-mysql-standards-compliance/index.md)
        * [Extensões do MySQL para SQL Padrão](/02-general-information/06-mysql-standards-compliance/01-mysql-extensions-to-standard-sql.md)
				* [Diferenças do MySQL em relação ao SQL Padrão](/02-general-information/06-mysql-standards-compliance/02-mysql-differences-from-standard-sql/index.md)
					* [Diferenças do MySQL em relação ao SQL Padrão](/02-general-information/06-mysql-standards-compliance/02-mysql-differences-from-standard-sql/index.md)
					* [Selecionar para tabela Diferenças](/02-general-information/06-mysql-standards-compliance/02-mysql-differences-from-standard-sql/01-selectintotable-differences.md)
					* [Diferenças do UPDATE](/02-general-information/06-mysql-standards-compliance/02-mysql-differences-from-standard-sql/02-update-differences.md)
					* [Diferenças entre a restrição de chave estrangeira](/02-general-information/06-mysql-standards-compliance/02-mysql-differences-from-standard-sql/03-foreignkey-constraint-differences.md)
					* [\'--\' como início de um comentário'](/02-general-information/06-mysql-standards-compliance/02-mysql-differences-from-standard-sql/04-as-the-start-of-a-comment.md)
							
  * [Instalação e Atualização do MySQL](/03-installing-and-upgrading-my-sql/index.md)
		collapsed: true,
		items: [
			{
				text: 'Orientações Gerais de Instalação',
				link: '/03-installing-and-upgrading-my-sql/01-general-installation-guidance/index.md',
				collapsed: true,
				items: [
					{
						text: 'Plataformas suportadas',
						link: '/03-installing-and-upgrading-my-sql/01-general-installation-guidance/01-supported-platforms.md'
					},
					{
						text: 'Qual versão e distribuição do MySQL para instalar',
						link: '/03-installing-and-upgrading-my-sql/01-general-installation-guidance/02-which-mysql-version-and-distribution.md'
					},
					{
						text: 'Como obter o MySQL',
						link: '/03-installing-and-upgrading-my-sql/01-general-installation-guidance/03-how-to-get-my-sql.md'
					},
					{
						text: 'Planos de instalação',
						link: '/03-installing-and-upgrading-my-sql/01-general-installation-guidance/05-installation-layouts.md'
					},
					{
						text: 'Características de compilação específicas do compilador',
						link: '/03-installing-and-upgrading-my-sql/01-general-installation-guidance/06-compiler-specific-build-characteristics.md'
					},
					{
						text: 'Verificar a integridade do pacote usando verificações MD5 ou GnuPG',
						link: '/03-installing-and-upgrading-my-sql/01-general-installation-guidance/04-verifying-package-integrity/index.md',
						collapsed: true,
						items: [
							{
								text: 'Verificar o checksum MD5',
								link: '/03-installing-and-upgrading-my-sql/01-general-installation-guidance/04-verifying-package-integrity/01-verifying-the-md5-checksum.md'
							},
							{
								text: 'Verificação de assinatura usando o GnuPG',
								link: '/03-installing-and-upgrading-my-sql/01-general-installation-guidance/04-verifying-package-integrity/02-signature-checking-using-gnu-pg.md'
							},
							{
								text: 'Verificação de assinatura usando o Gpg4win para Windows',
								link: '/03-installing-and-upgrading-my-sql/01-general-installation-guidance/04-verifying-package-integrity/03-signature-checking-using-gpg4.md'
							},
							{
								text: 'Verificação de assinatura usando RPM',
								link: '/03-installing-and-upgrading-my-sql/01-general-installation-guidance/04-verifying-package-integrity/04-signature-checking-using-rpm.md'
							},
							{
								text: 'Chave de Construção Pública GPG para Pacotes Arquivados',
								link: '/03-installing-and-upgrading-my-sql/01-general-installation-guidance/04-verifying-package-integrity/05-gpg-public-build-key-for-archived-packages.md'
							}
						]
					}

				]
			},
			{
				text: 'Instalar o MySQL no Unix/Linux usando binários genéricos',
				link: '/03-installing-and-upgrading-my-sql/02-installing-mysql-on-unix-linux-using-generic-binaries.md'
			},
			{
				text: 'Instalação do MySQL no Microsoft Windows',
				link: '/03-installing-and-upgrading-my-sql/03-installing-my-sql-on-microsoft-windows/index.md',
				collapsed: true,
				items: [
					{
						text: 'Estrutura de instalação do MySQL no Microsoft Windows',
						link: '/03-installing-and-upgrading-my-sql/03-installing-my-sql-on-microsoft-windows/01-mysql-installation-layout-on-microsoft-windows.md'
					},
					{
						text: 'Escolhendo um pacote de instalação',
						link: '/03-installing-and-upgrading-my-sql/03-installing-my-sql-on-microsoft-windows/02-choosing-an-installation-package.md'
					},
					{
						text: 'Instalador do MySQL para Windows',
						link: '/03-installing-and-upgrading-my-sql/03-installing-my-sql-on-microsoft-windows/03-mysql-installer-for-windows/index.md',
						items: [
							{
								text: 'Configuração inicial do instalador do MySQL',
								link: '/03-installing-and-upgrading-my-sql/03-installing-my-sql-on-microsoft-windows/03-mysql-installer-for-windows/01-my-sql-installer-initial-setup.md'
							},
							{
								text: 'Configurando caminhos alternativos de servidor com o instalador do MySQL',
								link: '/03-installing-and-upgrading-my-sql/03-installing-my-sql-on-microsoft-windows/03-mysql-installer-for-windows/02-setting-alternative-server-paths.md'
							},
							{
								text: 'Fluxos de trabalho de instalação com o Instalador MySQL',
								link: '/03-installing-and-upgrading-my-sql/03-installing-my-sql-on-microsoft-windows/03-mysql-installer-for-windows/03-installation-workflows.md'
							},
							{
								text: 'Catálogo de produtos e painel de controle do instalador MySQL',
								link: '/03-installing-and-upgrading-my-sql/03-installing-my-sql-on-microsoft-windows/03-mysql-installer-for-windows/04-my-sql-installer-product-catalog-and-dashboard.md'
							},
							{
								text: 'Referência do Console do Instalador do MySQL',
								link: '/03-installing-and-upgrading-my-sql/03-installing-my-sql-on-microsoft-windows/03-mysql-installer-for-windows/05-my-sql-installer-console-reference.md'
							}
						]
					},
					{
						text: 'Instalando o MySQL no Microsoft Windows usando um arquivo ZIP `noinstall`',
						link: '/03-installing-and-upgrading-my-sql/03-installing-my-sql-on-microsoft-windows/04-installing-mysql-on-microsoft/index.md',
						collapsed: true,
						items: [
							{
								text: 'Extrair o arquivo de instalação',
								link: '/03-installing-and-upgrading-my-sql/03-installing-my-sql-on-microsoft-windows/04-installing-mysql-on-microsoft/01-extracting-the-install-archive.md'
							},
							{
								text: 'Criando um arquivo de opção',
								link: '/03-installing-and-upgrading-my-sql/03-installing-my-sql-on-microsoft-windows/04-installing-mysql-on-microsoft/02-creating-an-option-file.md'
							},
							{
								text: 'Selecionando um tipo de servidor MySQL',
								link: '/03-installing-and-upgrading-my-sql/03-installing-my-sql-on-microsoft-windows/04-installing-mysql-on-microsoft/03-selecting-a-my-s-q-l-server-type.md'
							},
							{
								text: 'Inicializando o Diretório de Dados',
								link: '/03-installing-and-upgrading-my-sql/03-installing-my-sql-on-microsoft-windows/04-installing-mysql-on-microsoft/04-initializing-the-data-directory.md'
							},
							{
								text: 'Começando o servidor pela primeira vez',
								link: '/03-installing-and-upgrading-my-sql/03-installing-my-sql-on-microsoft-windows/04-installing-mysql-on-microsoft/05-starting-the-server-for-the-first-time.md'
							},
							{
								text: 'Começando o MySQL a partir da linha de comando do Windows',
								link: '/03-installing-and-upgrading-my-sql/03-installing-my-sql-on-microsoft-windows/04-installing-mysql-on-microsoft/06-starting-my-s-q-l-from-the-windows-command-line.md'
							},
							{
								text: 'Personalizar o caminho para as ferramentas do MySQL',
								link: '/03-installing-and-upgrading-my-sql/03-installing-my-sql-on-microsoft-windows/04-installing-mysql-on-microsoft/07-customizing-the-p-a-t-h-for-my-s-q-l-tools.md'
							},
							{
								text: 'Começar o MySQL como um serviço do Windows',
								link: '/03-installing-and-upgrading-my-sql/03-installing-my-sql-on-microsoft-windows/04-installing-mysql-on-microsoft/08-starting-my-s-q-l-as-a-windows-service.md'
							},
							{
								text: 'Testando a Instalação do MySQL',
								link: '/03-installing-and-upgrading-my-sql/03-installing-my-sql-on-microsoft-windows/04-installing-mysql-on-microsoft/09-testing-the-my-s-q-l-installation.md'
							}
						]
					},
					{
						text: 'Solução de problemas de instalação do Microsoft Windows MySQL Server',
						link: '/03-installing-and-upgrading-my-sql/03-installing-my-sql-on-microsoft-windows/05-troubleshooting-a-microsoft-windows.md'
					},
					{
						text: 'Procedimentos pós-instalação do Windows',
						link: '/03-installing-and-upgrading-my-sql/03-installing-my-sql-on-microsoft-windows/06-windows-postinstallation-procedures.md'
					},
					{
						text: 'Restrições da Plataforma Windows',
						link: '/03-installing-and-upgrading-my-sql/03-installing-my-sql-on-microsoft-windows/07-windows-platform-restrictions.md'
					}
				]
			},
			{
				text: 'Instalando o MySQL no macOS',
				link: '/03-installing-and-upgrading-my-sql/04-installing-my-sql-on-mac-os/index.md',
				collapsed: true,
				items: [
					{
						text: 'Notas gerais sobre a instalação do MySQL no macOS',
						link: '/03-installing-and-upgrading-my-sql/04-installing-my-sql-on-mac-os/01-general-notes-on-installing.md'
					},
					{
						text: 'Instalando o MySQL no macOS usando pacotes nativos',
						link: '/03-installing-and-upgrading-my-sql/04-installing-my-sql-on-mac-os/02-installing-mysql-on-mac-os-using-native-packages.md'
					},
					{
						text: 'Instalação do Daemon de Inicialização do MySQL',
						link: '/03-installing-and-upgrading-my-sql/04-installing-my-sql-on-mac-os/03-installing-a-mysql-launch-daemon.md'
					},
					{
						text: 'Instalando e usando o painel de preferências do MySQL',
						link: '/03-installing-and-upgrading-my-sql/04-installing-my-sql-on-mac-os/04-installing-and-using-the-mysql-preference-pane.md'
					}
				]
			},
			{
				text: 'Instalar o MySQL no Linux',
				link: '/03-installing-and-upgrading-my-sql/05-installing-mysql-on-linux/index.md',
				collapsed: true,
				items: [
					{
						text: 'Instalar o MySQL no Linux usando o repositório Yum do MySQL',
						link: '/03-installing-and-upgrading-my-sql/05-installing-mysql-on-linux/01-installing-mysql-on-linux-using-the-mysql-yum-repository.md'
					},
					{
						text: 'Substituindo uma Distribuição de Terceiros do MySQL Usando o Repositório Yum do MySQL',
						link: '/03-installing-and-upgrading-my-sql/05-installing-mysql-on-linux/02-replacing-a-third-party-distribution.md'
					},
					{
						text: 'Instalar o MySQL no Linux usando o repositório APT do MySQL',
						link: '/03-installing-and-upgrading-my-sql/05-installing-mysql-on-linux/03-installing-mysql-on-linux-using-the-mysql-apt-repository.md'
					},
					{
						text: 'Instalando o MySQL no Linux usando o repositório MySQL SLES',
						link: '/03-installing-and-upgrading-my-sql/05-installing-mysql-on-linux/04-installing-mysql-on-linux-using-the-mysql-s-l-e-s-repository.md'
					},
					{
						text: 'Instalar o MySQL no Linux usando pacotes RPM da Oracle',
						link: '/03-installing-and-upgrading-my-sql/05-installing-mysql-on-linux/05-installing-my-s-q-l-on-linux-using-r-p-m-packages-from-oracle.md'
					},
					{
						text: 'Instalar o MySQL no Linux usando pacotes do Debian da Oracle',
						link: '/03-installing-and-upgrading-my-sql/05-installing-mysql-on-linux/06-installing-my-s-q-l-on-linux-using-debian-packages-from-oracle.md'
					},
					{
						text: 'Implantação do MySQL no Linux com Docker',
						link: '/03-installing-and-upgrading-my-sql/05-installing-mysql-on-linux/07-deploying-mysql-on-linux-with-docker/index.md',
						items: [
							{
								text: 'Passos básicos para a implantação do servidor MySQL com o Docker',
								link: '/03-installing-and-upgrading-my-sql/05-installing-mysql-on-linux/07-deploying-mysql-on-linux-with-docker/01-basic-steps-for-my-s-q-l-server-deployment-with-docker.md'
							},
							{
								text: 'Mais tópicos sobre implantação do servidor MySQL com Docker',
								link: '/03-installing-and-upgrading-my-sql/05-installing-mysql-on-linux/07-deploying-mysql-on-linux-with-docker/02-more-topics-on-deploying-my-s-q-l-server-with-docker.md'
							},
							{
								text: 'Implantação do MySQL no Windows e em outras plataformas não Linux com o Docker',
								link: '/03-installing-and-upgrading-my-sql/05-installing-mysql-on-linux/07-deploying-mysql-on-linux-with-docker/03-deploying-my-s-q-l-on-windows-and-other-non-linux-platforms-with-docker.md'
							}
						]
					},
					{
						text: 'Instalando o MySQL no Linux a partir dos repositórios de software nativo',
						link: '/03-installing-and-upgrading-my-sql/05-installing-mysql-on-linux/08-installing-my-s-q-l-on-linux-from-the-native-software-repositories.md'
					},
					{
						text: 'Instalando o MySQL no Linux com o Juju',
						link: '/03-installing-and-upgrading-my-sql/05-installing-mysql-on-linux/09-installing-my-s-q-l-on-linux-with-juju.md'
					},
					{
						text: 'Gerenciando o servidor MySQL com o systemd',
						link: '/03-installing-and-upgrading-my-sql/05-installing-mysql-on-linux/10-managing-my-s-q-l-server-with-systemd.md'
					}
				]
			},
			{
				text: 'Instalando o MySQL no Solaris',
				link: '/03-installing-and-upgrading-my-sql/07-installing-mysql-on-solaris/index.md',
				collapsed: true,
				items: [
					{
						text: 'Instalar o MySQL no Solaris usando um PKG do Solaris',
						link: '/03-installing-and-upgrading-my-sql/07-installing-mysql-on-solaris/01-installing-my-s-q-l-on-solaris-using-a-solaris-pkg.md'
					}
				]
			},
			{
				text: 'Instalando o MySQL a partir da fonte',
				link: '/03-installing-and-upgrading-my-sql/08-installing-mysql-from-source/index.md',
				collapsed: true,
				items: [
					{
						text: 'Métodos de instalação da fonte',
						link: '/03-installing-and-upgrading-my-sql/08-installing-mysql-from-source/01-source-installation-methods.md'
					},
					{
						text: 'Requisitos de instalação da fonte',
						link: '/03-installing-and-upgrading-my-sql/08-installing-mysql-from-source/02-source-installation-prerequisites.md'
					},
					{
						text: 'Layout do MySQL para Instalação de Fonte',
						link: '/03-installing-and-upgrading-my-sql/08-installing-mysql-from-source/03-my-s-q-l-layout-for-source-installation.md'
					},
					{
						text: 'Instalação do MySQL usando uma distribuição de fonte padrão',
						link: '/03-installing-and-upgrading-my-sql/08-installing-mysql-from-source/04-installing-my-s-q-l-using-a-standard-source-distribution.md'
					},
					{
						text: 'Instalação do MySQL usando uma árvore de fonte de desenvolvimento',
						link: '/03-installing-and-upgrading-my-sql/08-installing-mysql-from-source/05-installing-my-s-q-l-using-a-development-source-tree.md'
					},
					{
						text: 'Configurando Suporte à Biblioteca SSL',
						link: '/03-installing-and-upgrading-my-sql/08-installing-mysql-from-source/06-configuring-s-s-l-library-support.md'
					},
					{
						text: 'Opções de configuração de fonte do MySQL',
						link: '/03-installing-and-upgrading-my-sql/08-installing-mysql-from-source/07-my-s-q-l-source-configuration-options.md'
					},
					{
						text: 'Lidando com problemas de compilação do MySQL',
						link: '/03-installing-and-upgrading-my-sql/08-installing-mysql-from-source/08-dealing-with-problems-compiling-my-sql.md'
					},
					{
						text: 'Configuração do MySQL e Ferramentas de Terceiros',
						link: '/03-installing-and-upgrading-my-sql/08-installing-mysql-from-source/09-my-s-q-l-configuration-and-third-party-tools.md'
					}
				]
			},
			{
				text: 'Configuração e teste pós-instalação',
				link: '/03-installing-and-upgrading-my-sql/09-postinstallation-setup-and-testing/index.md',
				collapsed: true,
				items: [
					{
						text: 'Inicializando o Diretório de Dados',
						link: '/03-installing-and-upgrading-my-sql/09-postinstallation-setup-and-testing/01-initializing-the-data-directory.md'
					},
					{
						text: 'Começando o servidor',
						link: '/03-installing-and-upgrading-my-sql/09-postinstallation-setup-and-testing/02-starting-the-server/index.md',
						collapsed: true,
						items: [
							{
								text: 'Solução de problemas para iniciar o servidor MySQL',
								link: '/03-installing-and-upgrading-my-sql/09-postinstallation-setup-and-testing/02-starting-the-server/01-troubleshooting-problems-starting-the-my-s-q-l-server.md'
							}
						]
					},
					{
						text: 'Testando o servidor',
						link: '/03-installing-and-upgrading-my-sql/09-postinstallation-setup-and-testing/03-testing-the-server.md'
					},
					{
						text: 'Segurança da conta inicial do MySQL',
						link: '/03-installing-and-upgrading-my-sql/09-postinstallation-setup-and-testing/04-securing-the-initial-my-s-q-l-account.md'
					},
					{
						text: 'Iniciar e parar o MySQL automaticamente',
						link: '/03-installing-and-upgrading-my-sql/09-postinstallation-setup-and-testing/05-starting-and-stopping-my-s-q-l-automatically.md'
					}
				]
			},
			{
				text: 'Atualização do MySQL',
				link: '/03-installing-and-upgrading-my-sql/10-upgrading-my-sql/index.md',
				collapsed: true,
				items: [
					{
						text: 'Antes de começar',
						link: '/03-installing-and-upgrading-my-sql/10-upgrading-my-sql/01-before-you-begin.md'
					},
					{
						text: 'Caminhos de atualização',
						link: '/03-installing-and-upgrading-my-sql/10-upgrading-my-sql/02-upgrade-paths.md'
					},
					{
						text: 'Alterações no MySQL 5.7',
						link: '/03-installing-and-upgrading-my-sql/10-upgrading-my-sql/03-changes-in-my-s-q-l-5-7.md'
					},
					{
						text: 'Atualização de instalações binárias ou baseadas em pacotes do MySQL no Unix/Linux',
						link: '/03-installing-and-upgrading-my-sql/10-upgrading-my-sql/04-upgrading-my-s-q-l-binary-or-package-based-installations-on-unix-linux.md'
					},
					{
						text: 'Atualizando o MySQL com o Repositório Yum do MySQL',
						link: '/03-installing-and-upgrading-my-sql/10-upgrading-my-sql/05-upgrading-my-s-q-l-with-the-my-s-q-l-yum-repository.md'
					},
					{
						text: 'Atualizando o MySQL com o Repositório MySQL APT',
						link: '/03-installing-and-upgrading-my-sql/10-upgrading-my-sql/06-upgrading-my-s-q-l-with-the-my-s-q-l-a-p-t-repository.md'
					},
					{
						text: 'Atualização do MySQL com o Repositório MySQL SLES',
						link: '/03-installing-and-upgrading-my-sql/10-upgrading-my-sql/07-upgrading-my-s-q-l-with-the-my-s-q-l-s-l-e-s-repository.md'
					},
					{
						text: 'Atualização do MySQL no Windows',
						link: '/03-installing-and-upgrading-my-sql/10-upgrading-my-sql/08-upgrading-my-s-q-l-on-windows.md'
					},
					{
						text: 'Atualizando uma Instalação Docker do MySQL',
						link: '/03-installing-and-upgrading-my-sql/10-upgrading-my-sql/09-upgrading-a-docker-installation-of-my-sql.md'
					},
					{
						text: 'Atualizando o MySQL com pacotes RPM baixados diretamente',
						link: '/03-installing-and-upgrading-my-sql/10-upgrading-my-sql/10-upgrading-my-s-q-l-with-directly-downloaded-r-p-m-packages.md'
					},
					{
						text: 'Solução de problemas de atualização',
						link: '/03-installing-and-upgrading-my-sql/10-upgrading-my-sql/11-upgrade-troubleshooting.md'
					},
					{
						text: 'Reestruturação ou reparo de tabelas ou índices',
						link: '/03-installing-and-upgrading-my-sql/10-upgrading-my-sql/12-rebuilding-or-repairing-tables-or-indexes.md'
					},
					{
						text: 'Copiar bancos de dados MySQL para outra máquina',
						link: '/03-installing-and-upgrading-my-sql/10-upgrading-my-sql/13-copying-my-s-q-l-databases-to-another-machine.md'
					}
				]
			},
			{
				text: 'Desatualização do MySQL',
				link: '/03-installing-and-upgrading-my-sql/11-downgrading-my-sql/index.md',
				collapsed: true,
				items: [
					{
						text: 'Antes de começar',
						link: '/03-installing-and-upgrading-my-sql/11-downgrading-my-sql/01-before-you-begin.md'
					},
					{
						text: 'Caminhos de Downgrade',
						link: '/03-installing-and-upgrading-my-sql/11-downgrading-my-sql/02-downgrade-paths.md'
					},
					{
						text: 'Notas de Downgrade',
						link: '/03-installing-and-upgrading-my-sql/11-downgrading-my-sql/03-downgrade-notes.md'
					},
					{
						text: 'Desatualização de Instalações Binárias e Baseadas em Pacotes no Unix/Linux',
						link: '/03-installing-and-upgrading-my-sql/11-downgrading-my-sql/04-downgrading-binary-and-package-based-installations-on-unix-linux.md'
					},
					{
						text: 'Solução de problemas de downgrade',
						link: '/03-installing-and-upgrading-my-sql/11-downgrading-my-sql/05-downgrade-troubleshooting.md'
					}
				]
			},
			{
				text: 'Notas de instalação do Perl',
				link: '/03-installing-and-upgrading-my-sql/12-perl-installation-notes/index.md',
				collapsed: true,
				items: [
					{
						text: 'Instalar o Perl no Unix',
						link: '/03-installing-and-upgrading-my-sql/12-perl-installation-notes/01-installing-perl-on-unix.md'
					},
					{
						text: 'Instalação do ActiveState Perl no Windows',
						link: '/03-installing-and-upgrading-my-sql/12-perl-installation-notes/02-installing-active-state-perl-on-windows.md'
					},
					{
						text: 'Problemas ao usar a interface Perl DBI/DBD',
						link: '/03-installing-and-upgrading-my-sql/12-perl-installation-notes/03-problems-using-the-perl-d-b-i-d-b-d-interface.md'
					}
				]
			}
		]
	},
	{
		text: 'Tutorial',
		link: '/04-tutorial/index.md',
		collapsed: true,
		items: [
			{
				text: 'Conectar e desconectar do servidor',
				link: '/04-tutorial/01-connecting-to-and-disconnecting-from-the-server.md'
			},
			{
				text: 'Inserindo Consultas',
				link: '/04-tutorial/02-entering-queries.md'
			},
			{
				text: 'Criando e usando um banco de dados',
				link: '/04-tutorial/03-creating-and-using-a-database/index.md',
				collapsed: true,
				items: [
					{
						text: 'Criando e selecionando um banco de dados',
						link: '/04-tutorial/03-creating-and-using-a-database/01-creating-and-selecting-a-database.md'
					},
					{
						text: 'Criando uma Tabela',
						link: '/04-tutorial/03-creating-and-using-a-database/02-creating-a-table.md'
					},
					{
						text: 'Carregando dados em uma tabela',
						link: '/04-tutorial/03-creating-and-using-a-database/03-loading-data-into-a-table.md'
					},
					{
						text: 'Recuperação de informações de uma tabela',
						link: '/04-tutorial/03-creating-and-using-a-database/04-retrieving-information-from-a-table/index.md',
						collapsed: true,
						items: [
							{
								text: 'Selecionando todos os dados',
								link: '/04-tutorial/03-creating-and-using-a-database/04-retrieving-information-from-a-table/01-selecting-all-data.md',
							},
							{
								text: 'Selecionando Linhas Específicas',
								link: '/04-tutorial/03-creating-and-using-a-database/04-retrieving-information-from-a-table/02-selecting-particular-rows.md'
							},
							{
								text: 'Selecionando Colunas Específicas',
								link: '/04-tutorial/03-creating-and-using-a-database/04-retrieving-information-from-a-table/03-selecting-particular-columns.md'
							},
							{
								text: 'Cálculos de data',
								link: '/04-tutorial/03-creating-and-using-a-database/04-retrieving-information-from-a-table/05-date-calculations.md'
							},
							{
								text: 'Trabalhando com Valores NULL',
								link: '/04-tutorial/03-creating-and-using-a-database/04-retrieving-information-from-a-table/06-working-with-n-u-l-l-values.md'
							},
							{
								text: 'Correspondência de Padrões',
								link: '/04-tutorial/03-creating-and-using-a-database/04-retrieving-information-from-a-table/07-pattern-matching.md'
							},
							{
								text: 'Contagem de Linhas',
								link: '/04-tutorial/03-creating-and-using-a-database/04-retrieving-information-from-a-table/08-counting-rows.md'
							},
							{
								text: 'Usar mais de uma tabela',
								link: '/04-tutorial/03-creating-and-using-a-database/04-retrieving-information-from-a-table/09-using-more-than-one-table.md'
							}
						]
					},
				]	
			},
			{
				text: 'Obtendo Informações sobre Bancos de Dados e Tabelas',
				link: '/04-tutorial/04-getting-information-about-databases-and-tables.md'
			},
			{
				text: 'Usando o mysql no Modo de Batch',
				link: '/04-tutorial/05-using-mysql-in-batch-mode.md'
			},
			{
				text: 'Exemplos de Perguntas Comuns',
				link: '/04-tutorial/06-examples-of-common-queries/index.md'
			}
		]
	}
]
