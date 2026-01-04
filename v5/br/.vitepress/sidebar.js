export default [
    { text: 'Prefácio e Avisos Legais', link: '/01-preface-and-legal-notices.md' },
    {
        text: 'Geral',
        collapsed: true,
        items: [
            {
                text: 'Informações gerais',
                link: '/02-general-information/index.md'
            },
            {
                text: 'Sobre este manual',
                link: '/02-general-information/01-about-this-manual.md'
            },
            {
                text: 'Visão geral do sistema de gerenciamento de banco de dados MySQL',
                link: '/02-general-information/02-overview-of-the-mysql-database-management-system/index.md',
                collapsed: true,
                items: [
                    {
                        text: 'O que é o MySQL?',
                        link: '/02-general-information/02-overview-of-the-mysql-database-management-system/01-whats-is-my-sql.md'
                    },
                    {
                        text: 'Principais características do MySQL',
                        link: '/02-general-information/02-overview-of-the-mysql-database-management-system/02-the-main-features-of-my-sql.md'
                    },
                    {
                        text: 'História do MySQL',
                        link: '/02-general-information/02-overview-of-the-mysql-database-management-system/03-history-of-my-sql.md'
                    }
                ]
            },
            {
                text: 'O que há de novo no MySQL 5.7',
                link: '/02-general-information/03-what-is-new-in-mysql-57.md'
            },
            {
                text: 'Variáveis e opções de servidor e status adicionadas, descontinuadas ou removidas no MySQL 5.7',
                link: '/02-general-information/04-server-and-status-variables.md'
            },
            {
                text: 'Como relatar bugs ou problemas',
                link: '/02-general-information/05-how-to-report-bugs-or-problems.md'
            },
            {
                text: 'Conformidade com os Padrões MySQL',
                link: '/02-general-information/06-mysql-standards-compliance/index.md',
                collapsed: true,
                items: [
                    { 
                        text: 'Extensões do MySQL para SQL Padrão',
                        link: '/02-general-information/06-mysql-standards-compliance/01-mysql-extensions-to-standard-sql.md'
                    },
                    {
                        text: 'Diferenças do MySQL em relação ao SQL Padrão',
                        link: '/02-general-information/06-mysql-standards-compliance/02-mysql-differences-from-standard-sql/index.md',
                        items: [
                            {
                                text: 'Diferenças do MySQL em relação ao SQL Padrão',
                                link: '/02-general-information/06-mysql-standards-compliance/02-mysql-differences-from-standard-sql/index.md'
                            },
                            {
                                text: 'Selecionar para tabela Diferenças',
                                link: '/02-general-information/06-mysql-standards-compliance/02-mysql-differences-from-standard-sql/01-selectintotable-differences.md'
                            },
                            {
                                text: 'Diferenças do UPDATE',
                                link: '/02-general-information/06-mysql-standards-compliance/02-mysql-differences-from-standard-sql/02-update-differences.md'
                            },
                            {
                                text: 'Diferenças entre a restrição de chave estrangeira',
                                link: '/02-general-information/06-mysql-standards-compliance/02-mysql-differences-from-standard-sql/03-foreignkey-constraint-differences.md'
                            },
                            {
                                text: '\'--\' como início de um comentário',
                                link: '/02-general-information/06-mysql-standards-compliance/02-mysql-differences-from-standard-sql/04-as-the-start-of-a-comment.md'
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        text: 'Instalação e Atualização do MySQL',
        link: '/03-installing-and-upgrading-my-sql/index.md',
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
            }
        ]
    }
]
