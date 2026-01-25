### 2.3.4 Instalando o MySQL no Microsoft Windows Usando um Arquivo ZIP `noinstall`

2.3.4.1 Extraindo o Arquivo de Instalação

2.3.4.2 Criando um Arquivo de Opções

2.3.4.3 Selecionando um Tipo de Servidor MySQL

2.3.4.4 Inicializando o Data Directory

2.3.4.5 Iniciando o Servidor pela Primeira Vez

2.3.4.6 Iniciando o MySQL a partir da Linha de Comando do Windows

2.3.4.7 Personalizando o PATH para Ferramentas MySQL

2.3.4.8 Iniciando o MySQL como um Serviço do Windows

2.3.4.9 Testando a Instalação do MySQL

Usuários que estão instalando a partir do pacote `noinstall` podem usar as instruções nesta seção para instalar o MySQL manualmente. O processo para instalar o MySQL a partir de um pacote ZIP Archive é o seguinte:

1. Extraia o arquivo principal para o diretório de instalação desejado

   *Opcional*: extraia também o arquivo `debug-test` se você planeja executar o `benchmark` e o `test suite` do MySQL

2. Crie um arquivo de opções
3. Escolha um tipo de servidor MySQL
4. Inicialize o MySQL
5. Inicie o servidor MySQL
6. Proteja as contas de usuário padrão

Este processo é descrito nas seções a seguir.