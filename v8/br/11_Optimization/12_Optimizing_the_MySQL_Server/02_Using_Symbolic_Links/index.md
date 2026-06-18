### 10.12.1 Usando Links Simbólicos

10.12.2.1 Uso de Links Simbólicos para Bancos de Dados no Unix

10.12.2.2 Usar Links Simbólicos para Tabelas MyISAM no Unix

10.12.2.3 Uso de Links Simbólicos para Bancos de Dados no Windows

Você pode mover bancos de dados ou tabelas do diretório do banco de dados para outros locais e substituí-los por links simbólicos para os novos locais. Você pode querer fazer isso, por exemplo, para mover um banco de dados para um sistema de arquivos com mais espaço livre ou aumentar a velocidade do seu sistema, espalhando suas tabelas para diferentes discos.

Para tabelas `InnoDB`, use a cláusula `DATA DIRECTORY` da instrução `CREATE TABLE` em vez de links simbólicos, conforme explicado na Seção 17.6.1.2, “Criando Tabelas Externamente”. Esta nova funcionalidade é uma técnica suportada e multiplataforma.

A maneira recomendada para fazer isso é criar um symlink para diretórios inteiros de banco de dados em um disco diferente. Crie um symlink para as tabelas `MyISAM` apenas como último recurso.

Para determinar a localização do diretório de seus dados, use esta declaração:

```
SHOW VARIABLES LIKE 'datadir';
```
