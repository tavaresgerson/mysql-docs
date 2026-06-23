## 29.2 Configuração de Configuração de Schema de Desempenho

O Schema de Desempenho é obrigatório e sempre compilado. É possível excluir determinadas partes da instrumentação do Schema de Desempenho. Por exemplo, para excluir a instrumentação de estágios e declarações, faça o seguinte:

```
$> cmake . \
        -DDISABLE_PSI_STAGE=1 \
        -DDISABLE_PSI_STATEMENT=1
```

Para mais informações, consulte as descrições das opções de `DISABLE_PSI_XXX` **CMake** na Seção 2.8.7, “Opções de Configuração de Fonte MySQL”.

Se você instalar o MySQL em uma instalação anterior que foi configurada sem o Schema de Desempenho (ou com uma versão mais antiga do Schema de Desempenho que tem tabelas ausentes ou desatualizadas), uma indicação desse problema é a presença de mensagens como as seguintes no log de erro:

```
[ERROR] Native table 'performance_schema'.'events_waits_history'
has the wrong structure
[ERROR] Native table 'performance_schema'.'events_waits_history_long'
has the wrong structure
...
```

Para corrigir esse problema, realize o procedimento de atualização do MySQL. Veja o Capítulo 3, *Atualizando o MySQL*.

Como o Schema de Desempenho é configurado no servidor na hora da construção, uma linha para `PERFORMANCE_SCHEMA` aparece na saída do `SHOW ENGINES`. Isso significa que o Schema de Desempenho está disponível, não que ele esteja habilitado. Para habilitá-lo, você deve fazer isso na inicialização do servidor, conforme descrito na próxima seção.