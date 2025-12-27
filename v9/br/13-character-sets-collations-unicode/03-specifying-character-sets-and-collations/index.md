## 12.3 Especificação de Conjuntos de Caracteres e Colagens

12.3.1 Convenções de Nomenclatura de Colagens

12.3.2 Conjunto de Caracteres e Colagem do Servidor

12.3.3 Conjunto de Caracteres e Colagem do Banco de Dados

12.3.4 Conjunto de Caracteres e Colagem da Tabela

12.3.5 Conjunto de Caracteres e Colagem da Coluna

12.3.6 Conjunto de Caracteres e Colagem Literal de Caracteres de String

12.3.7 O Conjunto de Caracteres Nacional

12.3.8 Introdutores de Conjunto de Caracteres

12.3.9 Exemplos de Atribuição de Conjunto de Caracteres e Colagem

12.3.10 Compatibilidade com Outros SGBD

Existem configurações padrão para conjuntos de caracteres e colagens em quatro níveis: servidor, banco de dados, tabela e coluna. A descrição nas seções seguintes pode parecer complexa, mas na prática, a definição de padrão em múltiplos níveis leva a resultados naturais e óbvios.

`CHARACTER SET` é usado em cláusulas que especificam um conjunto de caracteres. `CHARSET` pode ser usado como sinônimo de `CHARACTER SET`.

Problemas com conjuntos de caracteres afetam não apenas o armazenamento de dados, mas também a comunicação entre programas cliente e o servidor MySQL. Se você deseja que o programa cliente se comunique com o servidor usando um conjunto de caracteres diferente do padrão, é necessário indicar qual é o conjunto de caracteres. Por exemplo, para usar o conjunto de caracteres Unicode `latin1`, execute esta declaração após se conectar ao servidor:

```
SET NAMES 'latin1';
```

Para mais informações sobre problemas relacionados a conjuntos de caracteres na comunicação cliente/servidor, consulte a Seção 12.4, “Conjunto de Caracteres e Colagem de Conexão”.