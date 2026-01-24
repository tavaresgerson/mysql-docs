## 10.14 Adicionando uma Collation a um Character Set

10.14.1 Tipos de Implementação de Collation

10.14.2 Escolhendo um Collation ID

10.14.3 Adicionando uma Collation Simples a um Character Set de 8 Bits

10.14.4 Adicionando uma Collation UCA a um Character Set Unicode

Uma collation é um conjunto de regras que define como comparar e ordenar strings de caracteres. Cada collation no MySQL pertence a um único character set. Todo character set tem pelo menos uma collation, e a maioria tem duas ou mais collations.

Uma collation ordena caracteres baseada em pesos (weights). Cada caractere em um character set é mapeado para um peso. Caracteres com pesos iguais são comparados como iguais, e caracteres com pesos desiguais são comparados de acordo com a magnitude relativa de seus pesos.

A função `WEIGHT_STRING()` pode ser usada para ver os pesos dos caracteres em uma string. O valor que ela retorna para indicar os pesos é uma binary string, então é conveniente usar `HEX(WEIGHT_STRING(str))` para exibir os pesos em formato imprimível. O exemplo a seguir mostra que os pesos não diferem para maiúsculas/minúsculas (lettercase) para as letras em `'AaBb'` se for uma string nonbinary case-insensitive, mas diferem se for uma binary string:

```sql
mysql> SELECT HEX(WEIGHT_STRING('AaBb' COLLATE latin1_swedish_ci));
+------------------------------------------------------+
| HEX(WEIGHT_STRING('AaBb' COLLATE latin1_swedish_ci)) |
+------------------------------------------------------+
| 41414242                                             |
+------------------------------------------------------+
mysql> SELECT HEX(WEIGHT_STRING(BINARY 'AaBb'));
+-----------------------------------+
| HEX(WEIGHT_STRING(BINARY 'AaBb')) |
+-----------------------------------+
| 41614262                          |
+-----------------------------------+
```

O MySQL suporta várias implementações de collation, conforme discutido na Seção 10.14.1, “Tipos de Implementação de Collation”. Algumas delas podem ser adicionadas ao MySQL sem a necessidade de recompilação:

* Collations simples para character sets de 8 bits.
* Collations baseadas em UCA para character sets Unicode.
* Collations Binary (`xxx_bin`).

As seções a seguir descrevem como adicionar collations definidas pelo usuário dos dois primeiros tipos a character sets existentes. Todos os character sets existentes já possuem uma collation binary, então não é necessário descrever aqui como adicionar uma delas.

Resumo do procedimento para adicionar uma nova collation definida pelo usuário:

1. Escolha um Collation ID.
2. Adicione informações de configuração que nomeiam a collation e descrevem as regras de ordenação de caracteres.

3. Reinicie o server.
4. Verifique se o server reconhece a collation.

As instruções aqui cobrem apenas collations definidas pelo usuário que podem ser adicionadas sem a recompilação do MySQL. Para adicionar uma collation que exija recompilação (conforme implementado por meio de funções em um arquivo C source), use as instruções na Seção 10.13, “Adicionando um Character Set”. No entanto, em vez de adicionar todas as informações necessárias para um character set completo, modifique apenas os arquivos apropriados para um character set existente. Ou seja, com base no que já está presente para as collations atuais do character set, adicione estruturas de dados, funções e informações de configuração para a nova collation.

Note

Se você modificar uma collation existente definida pelo usuário, isso pode afetar a ordenação de linhas para Indexes em colunas que usam a collation. Neste caso, reconstrua quaisquer Indexes para evitar problemas como resultados de Query incorretos. Consulte a Seção 2.10.12, “Reconstruindo ou Reparando Tables ou Indexes”.

### Recursos Adicionais

* Exemplo mostrando como adicionar uma collation para full-text searches: Seção 12.9.7, “Adicionando uma Collation Definida pelo Usuário para Full-Text Indexing”

* A especificação do Unicode Collation Algorithm (UCA): <http://www.unicode.org/reports/tr10/>

* A especificação da Locale Data Markup Language (LDML): <http://www.unicode.org/reports/tr35/>