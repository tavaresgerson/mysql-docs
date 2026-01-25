# Capítulo 3 Tutorial

**Sumário**

[3.1 Conectando-se e Desconectando-se do Server](connecting-disconnecting.html)

[3.2 Inserindo Queries](entering-queries.html)

[3.3 Criando e Usando um Database](database-use.html) :   [3.3.1 Criando e Selecionando um Database](creating-database.html)

    [3.3.2 Criando uma Tabela](creating-tables.html)

    [3.3.3 Carregando Dados em uma Tabela](loading-tables.html)

    [3.3.4 Recuperando Informações de uma Tabela](retrieving-data.html)

[3.4 Obtendo Informações sobre Databases e Tabelas](getting-information.html)

[3.5 Usando o mysql em Batch Mode](batch-mode.html)

[3.6 Exemplos de Queries Comuns](examples.html) :   [3.6.1 O Valor Máximo para uma Coluna](example-maximum-column.html)

    [3.6.2 A Linha que Contém o Máximo de uma Determinada Coluna](example-maximum-row.html)

    [3.6.3 Máximo de Coluna por Grupo](example-maximum-column-group.html)

    [3.6.4 As Linhas que Contêm o Máximo Agrupado de uma Determinada Coluna](example-maximum-column-group-row.html)

    [3.6.5 Usando Variáveis Definidas pelo Usuário](example-user-variables.html)

    [3.6.6 Usando Foreign Keys](example-foreign-keys.html)

    [3.6.7 Buscando com Duas Keys](searching-on-two-keys.html)

    [3.6.8 Calculando Visitas por Dia](calculating-days.html)

    [3.6.9 Usando AUTO_INCREMENT](example-auto-increment.html)

[3.7 Usando MySQL com Apache](apache.html)

Este capítulo fornece uma introdução tutorial ao MySQL, mostrando como usar o programa [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client para criar e usar um Database simples. O [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") (às vezes chamado de “terminal monitor” ou apenas “monitor”) é um programa interativo que permite que você se conecte a um MySQL server, execute Queries e visualize os resultados. O [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") também pode ser usado em batch mode: você coloca suas Queries em um arquivo antecipadamente e, em seguida, instrui o [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") a executar o conteúdo do arquivo. Ambas as formas de usar o [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") são abordadas aqui.

Para visualizar uma lista de opções fornecidas pelo [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client"), invoque-o com a opção [`--help`](mysql-command-options.html#option_mysql_help):

```sql
$> mysql --help
```

Este capítulo pressupõe que o [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") esteja instalado na sua máquina e que um MySQL server esteja disponível para o qual você possa se conectar. Se isso não for verdade, entre em contato com seu administrador MySQL. (Se *você* for o administrador, você precisará consultar as partes relevantes deste manual, como [Capítulo 5, *MySQL Server Administration*](server-administration.html "Chapter 5 MySQL Server Administration").)

Este capítulo descreve todo o processo de configuração e uso de um Database. Se você estiver interessado apenas em acessar um Database existente, talvez queira pular as seções que descrevem como criar o Database e as tabelas que ele contém.

Devido à natureza tutorial deste capítulo, muitos detalhes são necessariamente omitidos. Consulte as seções relevantes do manual para obter mais informações sobre os tópicos abordados aqui.