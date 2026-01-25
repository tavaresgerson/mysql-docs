## 3.6 Exemplos de Consultas Comuns

[3.6.1 O Valor Máximo para uma Coluna](example-maximum-column.html)

[3.6.2 A Linha que Contém o Máximo de uma Determinada Coluna](example-maximum-row.html)

[3.6.3 Máximo de Coluna por Grupo](example-maximum-column-group.html)

[3.6.4 As Linhas que Contêm o Máximo Agrupado de uma Determinada Coluna](example-maximum-column-group-row.html)

[3.6.5 Usando Variáveis Definidas pelo Usuário](example-user-variables.html)

[3.6.6 Usando Foreign Keys](example-foreign-keys.html)

[3.6.7 Buscando em Duas Keys](searching-on-two-keys.html)

[3.6.8 Calculando Visitas Por Dia](calculating-days.html)

[3.6.9 Usando AUTO_INCREMENT](example-auto-increment.html)

Aqui estão exemplos de como resolver alguns problemas comuns com o MySQL.

Alguns dos exemplos usam a tabela `shop` para armazenar o preço de cada artigo (número do item) para certos comerciantes (dealers). Supondo que cada comerciante tenha um único preço fixo por artigo, então (`article`, `dealer`) é uma Primary Key para os registros.

Inicie a ferramenta de linha de comando [**mysql**](mysql.html "4.5.1 mysql — O Cliente de Linha de Comando do MySQL") e selecione um Database:

```sql
$> mysql your-database-name
```

Para criar e popular a tabela de exemplo, use estas instruções:

```sql
CREATE TABLE shop (
    article INT UNSIGNED  DEFAULT '0000' NOT NULL,
    dealer  CHAR(20)      DEFAULT ''     NOT NULL,
    price   DECIMAL(16,2) DEFAULT '0.00' NOT NULL,
    PRIMARY KEY(article, dealer));
INSERT INTO shop VALUES
    (1,'A',3.45),(1,'B',3.99),(2,'A',10.99),(3,'B',1.45),
    (3,'C',1.69),(3,'D',1.25),(4,'D',19.95);
```

Após executar as instruções, a tabela deve ter o seguinte conteúdo:

```sql
SELECT * FROM shop ORDER BY article;

+---------+--------+-------+
| article | dealer | price |
+---------+--------+-------+
|       1 | A      |  3.45 |
|       1 | B      |  3.99 |
|       2 | A      | 10.99 |
|       3 | B      |  1.45 |
|       3 | C      |  1.69 |
|       3 | D      |  1.25 |
|       4 | D      | 19.95 |
+---------+--------+-------+
```