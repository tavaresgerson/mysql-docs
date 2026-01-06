## 3.6 Exemplos de Perguntas Comuns

[3.6.1 O valor máximo para uma coluna](example-maximum-column.html)

[3.6.2 A linha que contém o valor máximo de uma determinada coluna](example-maximum-row.html)

[3.6.3 Máximo de Colunas por Grupo](example-maximum-column-group.html)

[3.6.4 As linhas que retêm o máximo por grupo de uma determinada coluna](example-maximum-column-group-row.html)

[3.6.5 Uso de variáveis definidas pelo usuário](example-user-variables.html)

[3.6.6 Usando Chaves Estrangeiras](example-foreign-keys.html)

[3.6.7 Pesquisar em duas chaves](searching-on-two-keys.html)

[3.6.8 Cálculo de visitas por dia](calculando-dias.html)

[3.6.9 Usando AUTO\_INCREMENT](example-auto-increment.html)

Aqui estão exemplos de como resolver alguns problemas comuns com o MySQL.

Alguns dos exemplos usam a tabela `shop` para armazenar o preço de cada artigo (número do item) para certos comerciantes (distribuidores). Supondo que cada comerciante tenha um preço fixo único por artigo, então (`article`, `dealer`) é uma chave primária para os registros.

Inicie a ferramenta de linha de comando [**mysql**](mysql.html) e selecione um banco de dados:

```sql
$> mysql your-database-name
```

Para criar e povoar a tabela de exemplo, use essas instruções:

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

Após a emissão das declarações, a tabela deve ter o seguinte conteúdo:

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
