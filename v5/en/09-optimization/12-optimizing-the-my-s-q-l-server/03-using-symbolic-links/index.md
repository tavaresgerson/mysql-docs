### 8.12.3 Usando Links Simbólicos

8.12.3.1 Usando Links Simbólicos para Databases no Unix

8.12.3.2 Usando Links Simbólicos para Tabelas MyISAM no Unix

8.12.3.3 Usando Links Simbólicos para Databases no Windows

Você pode mover databases ou tabelas do diretório de database para outros locais e substituí-los por links simbólicos que apontam para os novos locais. Você pode querer fazer isso, por exemplo, para mover um database para um sistema de arquivos com mais espaço livre ou para aumentar a velocidade do seu sistema distribuindo suas tabelas em discos diferentes.

Para tabelas `InnoDB`, utilize a cláusula `DATA DIRECTORY` do comando `CREATE TABLE` em vez de links simbólicos, conforme explicado na Seção 14.6.1.2, “Criando Tabelas Externamente”. Este novo recurso é uma técnica suportada e multiplataforma (cross-platform).

A maneira recomendada de fazer isso é criar links simbólicos (symlink) para diretórios de databases inteiros em um disco diferente. Crie links simbólicos para tabelas `MyISAM` apenas como último recurso.

Para determinar a localização do seu diretório de dados (data directory), utilize este comando:

```sql
SHOW VARIABLES LIKE 'datadir';
```