export default [
    { text: 'Prefácio e Avisos Legais', link: '/01-preface-and-legal-notices.md' },
    {
        text: 'Geral',
        collapsed: false,
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
]
