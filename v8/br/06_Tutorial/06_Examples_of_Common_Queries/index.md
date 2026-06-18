## 5.6 Exemplos de Perguntas Comuns

5.6.1 Valor Máximo para uma Coluna

5.6.2 A linha que contém o máximo de uma determinada coluna

5.6.3 Máximo de Colunas por Grupo

5.6.4 As Linhas que Armazenam o Máximo por Grupo de uma Cálculo Específica

5.6.5 Uso de variáveis definidas pelo usuário

5.6.6 Uso de Chaves Estrangeiras

5.6.7 Pesquisar em duas chaves

5.6.8 Cálculo de visitas por dia

5.6.9 Usando AUTO\_INCREMENT

Aqui estão exemplos de como resolver alguns problemas comuns com o MySQL.

Alguns dos exemplos usam a tabela `shop` para armazenar o preço de cada artigo (número do item) para certos comerciantes (distribuidores). Supondo que cada comerciante tenha um preço fixo único por artigo, então (`article`, `dealer`) é uma chave primária para os registros.

Inicie a ferramenta de linha de comando **mysql** e selecione um banco de dados:

```
$> mysql your-database-name
```

Para criar e povoar a tabela de exemplo, use essas instruções:

```
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

```
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
