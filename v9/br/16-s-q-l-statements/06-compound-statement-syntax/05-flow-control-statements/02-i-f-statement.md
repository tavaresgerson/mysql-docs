#### 15.6.5.2 Instrução `IF`

```
IF search_condition THEN statement_list
    [ELSEIF search_condition THEN statement_list] ...
    [ELSE statement_list]
END IF
```

A instrução `IF` para programas armazenados implementa uma construção condicional básica.

Observação

Existe também uma função `IF()`, que difere da instrução `IF` descrita aqui. Veja a Seção 14.5, “Funções de Controle de Fluxo”. A instrução `IF` pode ter cláusulas `THEN`, `ELSE` e `ELSEIF`, e é encerrada com `END IF`.

Se uma *`condição de busca`* dada for avaliada como verdadeira, a cláusula correspondente `THEN` ou `ELSEIF` *`lista_instruções`* é executada. Se nenhuma *`condição de busca`* corresponder, a cláusula `ELSE` *`lista_instruções`* é executada.

Cada *`lista_instruções`* consiste em uma ou mais instruções SQL; uma *`lista_instruções`* vazia não é permitida.

Um bloco `IF ... END IF`, como todos os outros blocos de controle de fluxo usados em programas armazenados, deve ser encerrado com um ponto e vírgula, como mostrado neste exemplo:

```
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

Como com outras construções de controle de fluxo, os blocos `IF ... END IF` podem ser aninhados dentro de outros blocos de controle de fluxo, incluindo outras instruções `IF`. Cada `IF` deve ser encerrado por seu próprio `END IF` seguido de um ponto e vírgula. Você pode usar indentação para tornar os blocos de controle de fluxo aninhados mais facilmente legíveis para humanos (embora isso não seja exigido pelo MySQL), como mostrado aqui:

```
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

Neste exemplo, a `IF` interna é avaliada apenas se `n` não for igual a `m`.