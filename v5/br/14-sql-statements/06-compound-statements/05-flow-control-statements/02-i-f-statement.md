#### 13.6.5.2 Declaração IF

```sql
IF search_condition THEN statement_list
    [ELSEIF search_condition THEN statement_list] ...
    [ELSE statement_list]
END IF
```

A declaração [`IF`](if.html "13.6.5.2 IF Statement") para stored programs implementa um construto condicional básico.

Nota

Há também uma *função* [`IF()`](flow-control-functions.html#function_if), que difere da *declaração* [`IF`](if.html "13.6.5.2 IF Statement") descrita aqui. Consulte a [Seção 12.5, “Funções de Controle de Fluxo”](flow-control-functions.html "12.5 Funções de Controle de Fluxo"). A declaração [`IF`](if.html "13.6.5.2 IF Statement") pode ter cláusulas `THEN`, `ELSE` e `ELSEIF`, e é encerrada com `END IF`.

Se uma determinada *`search_condition`* for avaliada como true (verdadeira), a *`statement_list`* da cláusula `THEN` ou `ELSEIF` correspondente é executada. Se nenhuma *`search_condition`* for satisfeita, a *`statement_list`* da cláusula `ELSE` é executada.

Cada *`statement_list`* consiste em uma ou mais instruções SQL; uma *`statement_list`* vazia não é permitida.

Um bloco `IF ... END IF`, assim como todos os outros blocos de controle de fluxo usados em stored programs, deve ser terminado com um ponto e vírgula, conforme mostrado neste exemplo:

```sql
DELIMITER //

CREATE FUNCTION SimpleCompare(n INT, m INT)
  RETURNS VARCHAR(20)

  BEGIN
    DECLARE s VARCHAR(20);

    IF n > m THEN SET s = '>';
    ELSEIF n = m THEN SET s = '=';
    ELSE SET s = '<';
    END IF;

    SET s = CONCAT(n, ' ', s, ' ', m);

    RETURN s;
  END //

DELIMITER ;
```

Assim como ocorre com outros construtos de controle de fluxo, blocos `IF ... END IF` podem ser aninhados dentro de outros construtos de controle de fluxo, incluindo outras declarações [`IF`](if.html "13.6.5.2 IF Statement"). Cada [`IF`](if.html "13.6.5.2 IF Statement") deve ser encerrado pelo seu próprio `END IF` seguido por um ponto e vírgula. Você pode usar indentação para tornar blocos de controle de fluxo aninhados mais facilmente legíveis por humanos (embora isso não seja exigido pelo MySQL), conforme mostrado aqui:

```sql
DELIMITER //

CREATE FUNCTION VerboseCompare (n INT, m INT)
  RETURNS VARCHAR(50)

  BEGIN
    DECLARE s VARCHAR(50);

    IF n = m THEN SET s = 'equals';
    ELSE
      IF n > m THEN SET s = 'greater';
      ELSE SET s = 'less';
      END IF;

      SET s = CONCAT('is ', s, ' than');
    END IF;

    SET s = CONCAT(n, ' ', s, ' ', m, '.');

    RETURN s;
  END //

DELIMITER ;
```

Neste exemplo, o [`IF`](if.html "13.6.5.2 IF Statement") interno é avaliado apenas se `n` for diferente de `m`.