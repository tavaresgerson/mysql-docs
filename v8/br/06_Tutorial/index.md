# Capítulo 5 - Tutorial

**Índice**

5.1 Conectar e desconectar do servidor

5.2 Inserindo Consultas

5.3 Criando e usando um banco de dados:   5.3.1 Criando e selecionando um banco de dados

```
5.3.2 Creating a Table

5.3.3 Loading Data into a Table

5.3.4 Retrieving Information from a Table
```

5.4 Obtendo Informações sobre Bancos de Dados e Tabelas

5.5 Usando o mysql no modo de lote

5.6 Exemplos de Perguntas Comuns:   5.6.1 O Valor Máximo para uma Coluna

```
5.6.2 The Row Holding the Maximum of a Certain Column

5.6.3 Maximum of Column per Group

5.6.4 The Rows Holding the Group-wise Maximum of a Certain Column

5.6.5 Using User-Defined Variables

5.6.6 Using Foreign Keys

5.6.7 Searching on Two Keys

5.6.8 Calculating Visits Per Day

5.6.9 Using AUTO_INCREMENT
```

5.7 Usando o MySQL com o Apache

Este capítulo oferece uma introdução tutorial ao MySQL, mostrando como usar o programa cliente **mysql** para criar e usar um banco de dados simples. **mysql** (às vezes referido como o "monitor de terminal" ou simplesmente "monitor") é um programa interativo que permite conectar-se a um servidor MySQL, executar consultas e visualizar os resultados. **mysql** também pode ser usado em modo batch: você coloca suas consultas em um arquivo previamente, e depois diz ao **mysql** para executar o conteúdo do arquivo. Ambos os modos de uso do **mysql** são abordados aqui.

Para ver uma lista de opções fornecidas pelo **mysql**, invocá-lo com a opção `--help`:

```
$> mysql --help
```

Este capítulo assume que o **mysql** está instalado na sua máquina e que há um servidor MySQL disponível para o qual você pode se conectar. Se isso não for verdade, entre em contato com o administrador do MySQL. (Se você for o administrador, você precisa consultar as partes relevantes deste manual, como o Capítulo 7, *Administração do Servidor MySQL*.)

Este capítulo descreve todo o processo de configuração e uso de um banco de dados. Se você estiver interessado apenas em acessar um banco de dados existente, pode querer pular as seções que descrevem como criar o banco de dados e as tabelas que ele contém.

Como este capítulo é de natureza tutorial, muitos detalhes são necessariamente omitidos. Consulte as seções relevantes do manual para obter mais informações sobre os tópicos abordados aqui.
