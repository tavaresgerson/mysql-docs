# Capítulo 7 Administração do Servidor MySQL

**Índice**

7.1 O Servidor MySQL:   7.1.1 Configurando o Servidor

    7.1.2 Configurações Padrão do Servidor

    7.1.3 Validação das Configurações do Servidor

    7.1.4 Referência de Opções do Servidor, Variáveis de Sistema e Variáveis de Status

    7.1.5 Referência de Variáveis de Sistema do Servidor

    7.1.6 Referência de Variáveis de Status do Servidor

    7.1.7 Opções de Comando do Servidor

    7.1.8 Variáveis de Sistema do Servidor

    7.1.9 Usando Variáveis de Sistema

    7.1.10 Variáveis de Status do Servidor

    7.1.11 Modos SQL do Servidor

    7.1.12 Gerenciamento de Conexão

    7.1.13 Suporte ao IPv6

    7.1.14 Suporte ao Namespace de Rede

    7.1.15 Suporte ao Fuso Horário do Servidor MySQL

    7.1.16 Grupos de Recursos

    7.1.17 Suporte de Ajuda no Lado do Servidor

    7.1.18 Rastreamento do Estado das Sessões do Cliente pelo Servidor

    7.1.19 O Processo de Fechamento do Servidor

7.2 O Diretório de Dados do MySQL

7.3 O Esquema do Sistema mysql

7.4 Logs do Servidor MySQL:   7.4.1 Selecionando Destinos de Saída do Log de Consultas Gerais e do Log de Consultas Lentas

    7.4.2 O Log de Erros

    7.4.3 O Log de Consultas Gerais

    7.4.4 O Log Binário

    7.4.5 O Log de Consultas Lentas

    7.4.6 Manutenção do Log do Servidor

7.5 Componentes do MySQL:   7.5.1 Instalando e Desinstalando Componentes

    7.5.2 Obtendo Informações sobre Componentes

    7.5.3 Componentes do Log de Erros

    7.5.4 Componentes de Atributo de Consulta

    7.5.5 Componentes do Agendamento

    7.5.6 Componentes de Replicação

    7.5.7 Componentes do Motor Multilíngue (MLE)

    7.5.8 Componentes do Rastreador de Opções

7.6 Plugins do Servidor MySQL:   7.6.1 Instalando e Desinstalando Plugins

    7.6.2 Obtendo Informações sobre Plugins do Servidor

    7.6.3 MySQL Enterprise Thread Pool

    7.6.4 O Plugin de Reescrita de Consultas Rewriter

    7.6.5 O Plugin ddl\_rewriter

    7.6.6 O Plugin Clone

    7.6.7 O Plugin Proxy Bridge Keyring Bridge

7.6.8 Serviços de Plugin do MySQL

7.7 Funções Carregáveis do Servidor MySQL:   7.7.1 Instalação e Desinstalação de Funções Carregáveis

    7.7.2 Obtenção de Informações sobre Funções Carregáveis

7.8 Execução de Múltiplas Instâncias do MySQL em uma Máquina:   7.8.1 Configuração de Diretórios de Dados Múltiplos

    7.8.2 Execução de Múltiplas Instâncias do MySQL no Windows

    7.8.3 Execução de Múltiplas Instâncias do MySQL no Unix

    7.8.4 Uso de Programas de Cliente em um Ambiente de Múltiplos Servidores

7.9 Depuração do MySQL:   7.9.1 Depuração de um Servidor MySQL

    7.9.2 Depuração de um Cliente MySQL

    7.9.3 Ferramenta LOCK\_ORDER

    7.9.4 O Pacote DBUG

O Servidor MySQL (**mysqld**) é o programa principal que realiza a maior parte do trabalho em uma instalação do MySQL. Este capítulo fornece uma visão geral do Servidor MySQL e abrange a administração geral do servidor:

* Configuração do servidor
* O diretório de dados, particularmente o esquema de sistema `mysql`

* Arquivos de log do servidor
* Gerenciamento de múltiplos servidores em uma única máquina

Para obter informações adicionais sobre tópicos administrativos, consulte também:

* Capítulo 8, *Segurança*
* Capítulo 9, *Backup e Recuperação*
* Capítulo 19, *Replicação*