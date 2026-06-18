#### 15.2.7.3 Declaração de adiamento INSERT

```
INSERT DELAYED ...
```

A opção `DELAYED` para a declaração `INSERT` é uma extensão do MySQL para o SQL padrão. Em versões anteriores do MySQL, ela pode ser usada para certos tipos de tabelas (como `MyISAM`), de modo que, quando um cliente usa `INSERT DELAYED`, ele recebe uma confirmação do servidor de uma só vez, e a linha é colocada em fila para ser inserida quando a tabela não estiver sendo usada por nenhum outro thread.

Os operadores de inserção e substituição `DELAYED` foram descontinuados no MySQL 5.6. No MySQL 8.0, o operador `DELAYED` não é suportado. O servidor reconhece, mas ignora, a palavra-chave `DELAYED`, trata a inserção como uma inserção não atrasada e gera um aviso `ER_WARN_LEGACY_SYNTAX_CONVERTED`: A inserção atrasada não é mais suportada. A instrução foi convertida para INSERT. A palavra-chave `DELAYED` está prevista para ser removida em uma futura versão.
