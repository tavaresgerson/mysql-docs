### 8.12.3 Usando Links Simbólicos

8.12.3.1 Uso de Links Simbólicos para Bancos de Dados no Unix

8.12.3.2 Uso de Links Simbólicos para Tabelas MyISAM no Unix

8.12.3.3 Uso de Links Simbólicos para Bancos de Dados no Windows

Você pode mover bancos de dados ou tabelas do diretório do banco de dados para outros locais e substituí-los por links simbólicos para os novos locais. Você pode querer fazer isso, por exemplo, para mover um banco de dados para um sistema de arquivos com mais espaço livre ou aumentar a velocidade do seu sistema, espalhando suas tabelas para diferentes discos.

Para tabelas do `InnoDB`, use a cláusula `DATA DIRECTORY` da instrução `CREATE TABLE` em vez de links simbólicos, conforme explicado na Seção 14.6.1.2, “Criando Tabelas Externamente”. Essa nova funcionalidade é uma técnica compatível com várias plataformas.

A maneira recomendada para fazer isso é criar um symlink para diretórios inteiros de banco de dados em um disco diferente. Crie um symlink para as tabelas `MyISAM` apenas como último recurso.

Para determinar a localização do diretório de seus dados, use esta declaração:

```sql
SHOW VARIABLES LIKE 'datadir';
```
