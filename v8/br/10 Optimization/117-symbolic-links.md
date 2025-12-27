### 10.12.2 Usando Links Simbólicos

10.12.2.1 Usando Links Simbólicos para Bancos de Dados no Unix

10.12.2.2 Usando Links Simbólicos para Tabelas MyISAM no Unix

10.12.2.3 Usando Links Simbólicos para Bancos de Dados no Windows

Você pode mover bancos de dados ou tabelas do diretório do banco de dados para outros locais e substituí-los por links simbólicos para os novos locais. Você pode querer fazer isso, por exemplo, para mover um banco de dados para um sistema de arquivos com mais espaço livre ou aumentar a velocidade do seu sistema ao espalhar suas tabelas para diferentes discos.

Para tabelas `InnoDB`, use a cláusula `DATA DIRECTORY` da instrução `CREATE TABLE` em vez de links simbólicos, conforme explicado na Seção 17.6.1.2, “Criando Tabelas Externamente”. Esta nova funcionalidade é uma técnica suportada e multiplataforma.

A maneira recomendada de fazer isso é criar links simbólicos para diretórios inteiros de banco de dados para um disco diferente. Crie links simbólicos para tabelas `MyISAM` apenas como último recurso.

Para determinar a localização do seu diretório de dados, use esta instrução:

```
SHOW VARIABLES LIKE 'datadir';
```