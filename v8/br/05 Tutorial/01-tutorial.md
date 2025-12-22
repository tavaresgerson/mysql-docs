# Capítulo 5 Tutorial

Este capítulo fornece uma introdução tutorial ao MySQL mostrando como usar o programa cliente `mysql` para criar e usar um banco de dados simples. `mysql` (às vezes referido como o monitor terminal ou apenas monitor) é um programa interativo que permite que você se conecte a um servidor MySQL, execute consultas e exiba os resultados. `mysql` também pode ser usado em modo de lote: você coloca suas consultas em um arquivo de antemão, e depois diz ao `mysql` para executar o conteúdo do arquivo.

Para ver uma lista de opções fornecidas pelo `mysql`, invoque-o com a opção `--help`:

```
$> mysql --help
```

Este capítulo assume que `mysql` está instalado na sua máquina e que um servidor MySQL está disponível para que você possa se conectar. Se isso não for verdade, entre em contato com o seu administrador MySQL. (Se *você* é o administrador, você precisa consultar as partes relevantes deste manual, como o Capítulo 7, *Administração do Servidor MySQL*.)

Este capítulo descreve todo o processo de configuração e utilização de uma base de dados. Se estiver interessado apenas em aceder a uma base de dados existente, pode querer ignorar as secções que descrevem como criar a base de dados e as tabelas que contém.

Dado que este capítulo é de natureza tutorial, muitos pormenores são necessariamente omitidos.
