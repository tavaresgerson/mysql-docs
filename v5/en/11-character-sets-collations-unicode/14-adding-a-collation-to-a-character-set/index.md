## 10.14 Adicionando um Collation a um Character Set

10.14.1 Tipos de Implementação de Collation

10.14.2 Escolhendo um ID de Collation

10.14.3 Adicionando um Collation Simples a um Character Set de 8-Bits

10.14.4 Adicionando um Collation UCA a um Character Set Unicode

Um collation é um conjunto de regras que define como comparar e ordenar strings de caracteres. Cada collation no MySQL pertence a um único character set. Todo character set tem pelo menos um collation, e a maioria tem dois ou mais collations.

Um collation ordena caracteres com base em pesos (weights). Cada caractere em um character set é mapeado para um peso. Caracteres com pesos iguais são comparados como iguais, e caracteres com pesos diferentes são comparados de acordo com a magnitude relativa dos seus pesos.

A função `WEIGHT_STRING()` pode ser usada para ver os pesos dos caracteres em uma string. O valor que ela retorna para indicar os pesos é uma string binária, então é conveniente usar `HEX(WEIGHT_STRING(str))` para exibir os pesos em formato imprimível. O exemplo a seguir mostra que os pesos não diferem em relação à caixa (maiúscula/minúscula) para as letras em `'AaBb'` se for uma string *case-insensitive* não binária, mas diferem se for uma string binária:

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

* Collations simples para character sets de 8-bits.
* Collations baseados em UCA para character sets Unicode.
* Collations binários (`xxx_bin`).

As seções a seguir descrevem como adicionar collations definidos pelo usuário dos dois primeiros tipos a character sets existentes. Todos os character sets existentes já possuem um collation binário, então não é necessário descrever aqui como adicionar um.

Resumo do procedimento para adicionar um novo collation definido pelo usuário:

1. Escolha um ID de Collation.
2. Adicione informações de configuração que nomeiam o collation e descrevem as regras de ordenação de caracteres.
3. Reinicie o server.
4. Verifique se o server reconhece o collation.

As instruções aqui cobrem apenas collations definidos pelo usuário que podem ser adicionados sem a recompilação do MySQL. Para adicionar um collation que exija recompilação (implementado por meio de funções em um arquivo fonte C), use as instruções na Seção 10.13, “Adicionando um Character Set”. No entanto, em vez de adicionar todas as informações necessárias para um character set completo, apenas modifique os arquivos apropriados para um character set existente. Ou seja, com base no que já está presente para os collations atuais do character set, adicione estruturas de dados, funções e informações de configuração para o novo collation.

Nota

Se você modificar um collation definido pelo usuário existente, isso pode afetar a ordenação de linhas para Indexes em colunas que usam o collation. Neste caso, reconstrua quaisquer desses Indexes para evitar problemas como resultados de Query incorretos. Consulte a Seção 2.10.12, “Reconstruindo ou Reparando Tables ou Indexes”.

### Recursos Adicionais

* Exemplo mostrando como adicionar um collation para buscas de texto completo (full-text searches): Seção 12.9.7, “Adicionando um Collation Definido pelo Usuário para Indexação de Texto Completo”

* A especificação do Unicode Collation Algorithm (UCA): <http://www.unicode.org/reports/tr10/>

* A especificação do Locale Data Markup Language (LDML): <http://www.unicode.org/reports/tr35/>