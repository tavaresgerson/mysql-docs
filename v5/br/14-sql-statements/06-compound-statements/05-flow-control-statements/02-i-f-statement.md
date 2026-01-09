#### 13.6.5.2 Instrução IF

```sql
IF search_condition THEN statement_list
    [ELSEIF search_condition THEN statement_list] ...
    [ELSE statement_list]
END IF
```

A instrução `IF` para programas armazenados implementa uma construção condicional básica.

Nota

Existe também uma função *`IF()`* (flow-control-functions.html#function_if), que difere da declaração *`IF`* (if.html) descrita aqui. Veja Seção 12.5, “Funções de Controle de Fluxo”. A declaração *`IF`* (if.html) pode ter cláusulas `THEN`, `ELSE` e `ELSEIF`, e é finalizada com `END IF`.

Se uma *`search_condition`* dada avaliar como verdadeira, a cláusula correspondente `THEN` ou `ELSEIF` *`statement_list`* é executada. Se nenhuma *`search_condition`* corresponder, a cláusula `ELSE` *`statement_list`* é executada.

Cada *`statement_list`* consiste em uma ou mais instruções SQL; uma *`statement_list`* vazia não é permitida.

Um bloco `SE ... ENTÃO ... FIM SE`, assim como todos os outros blocos de controle de fluxo usados em programas armazenados, deve ser encerrado com um ponto e vírgula, como mostrado neste exemplo:

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

Assim como outros construtos de controle de fluxo, os blocos `IF ... END IF` podem ser aninhados dentro de outros construtos de controle de fluxo, incluindo outras instruções `IF`. Cada `IF` deve ser encerrado por seu próprio `END IF` seguido por um ponto e vírgula. Você pode usar indentação para tornar os blocos de controle de fluxo aninhados mais facilmente legíveis para humanos (embora isso não seja exigido pelo MySQL), como mostrado aqui:

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

Neste exemplo, o bloco interno `IF` é avaliado apenas se `n` não for igual a `m`.
