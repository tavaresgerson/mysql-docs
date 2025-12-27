## 12.14 Adicionando uma Colagem a um Conjunto de Caracteres

Aviso

As colágias definidas pelo usuário estão desatualizadas; você deve esperar que o suporte a elas seja removido em uma versão futura do MySQL. O servidor MySQL 8.4 emite um aviso para qualquer uso de `COLLATE user_defined_collation` em uma instrução SQL; um aviso também é emitido quando o servidor é iniciado com `--collation-server` definido igual ao nome de uma colágias definida pelo usuário.

Uma colágias é um conjunto de regras que define como comparar e ordenar cadeias de caracteres. Cada colágias em MySQL pertence a um único conjunto de caracteres. Cada conjunto de caracteres tem pelo menos uma colágias, e a maioria tem duas ou mais colágias.

A colágias ordena os caracteres com base em pesos. Cada caractere em um conjunto de caracteres é mapeado a um peso. Caracteres com pesos iguais são comparados como iguais, e caracteres com pesos desiguais são comparados de acordo com a magnitude relativa de seus pesos.

A função `WEIGHT_STRING()` pode ser usada para ver os pesos dos caracteres em uma string. O valor que ela retorna para indicar pesos é uma string binária, então é conveniente usar `HEX(WEIGHT_STRING(str))` para exibir os pesos na forma imprimível. O exemplo seguinte mostra que os pesos não diferem para maiúsculas e minúsculas nas letras em `'AaBb'` se for uma string não binária e sensível a maiúsculas e minúsculas, mas diferem se for uma string binária:

```
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

O MySQL suporta várias implementações de colágias, conforme discutido na Seção 12.14.1, “Tipos de Implementação de Colagem”. Algumas dessas podem ser adicionadas ao MySQL sem recompilar:

* Colágias simples para conjuntos de caracteres de 8 bits.
* Colágias baseadas em UCA para conjuntos de caracteres Unicode.
* Colágias binárias (`xxx_bin`).

As seções seguintes descrevem como adicionar colágias definidas pelo usuário dos dois primeiros tipos a conjuntos de caracteres existentes. Todos os conjuntos de caracteres existentes já têm uma colágias binária, então não há necessidade de descrever como adicionar uma aqui.

Aviso

A redefinição de colágias integradas não é suportada e pode resultar em comportamento inesperado do servidor.

Resumo do procedimento para adicionar uma nova collation definida pelo usuário:

1. Escolha um ID de collation.
2. Adicione informações de configuração que nomeiem a collation e descrevam as regras de ordenação de caracteres.
3. Reinicie o servidor.
4. Verifique se o servidor reconhece a collation.

As instruções aqui cobrem apenas collations definidas pelo usuário que podem ser adicionadas sem recompilar o MySQL. Para adicionar uma collation que exija recompilação (como implementada por meio de funções em um arquivo de código C), use as instruções na Seção 12.13, “Adicionando um Conjunto de Caracteres”. No entanto, em vez de adicionar todas as informações necessárias para um conjunto de caracteres completo, modifique apenas os arquivos apropriados para um conjunto de caracteres existente. Ou seja, com base no que já está presente para as collations atuais do conjunto de caracteres, adicione estruturas de dados, funções e informações de configuração para a nova collation.

::: info Nota

Se você modificar uma collation definida pelo usuário existente, isso pode afetar a ordenação de linhas para índices em colunas que usam a collation. Nesse caso, reconstrua quaisquer índices desse tipo para evitar problemas, como resultados de consultas incorretos. Consulte a Seção 3.14, “Reconstruindo ou Reparando Tabelas ou Índices”.

:::

### Recursos Adicionais

* Exemplo mostrando como adicionar uma collation para buscas de texto completo: Seção 14.9.7, “Adicionando uma Collation Definida pelo Usuário para Indexação de Texto Completo”
* A especificação do Algoritmo de Collation Unicode (UCA): <http://www.unicode.org/reports/tr10/>
* A especificação do Locale Data Markup Language (LDML): <http://www.unicode.org/reports/tr35/>