#### 15.7.4.5 Declaração de DESINSTALAÇÃO DE COMPONENTES

```
UNINSTALL COMPONENT component_name [, component_name ] ...
```

Esta declaração desativa e desinstala um ou mais componentes. Um componente fornece serviços que estão disponíveis para o servidor e outros componentes; consulte a Seção 7.5, “Componentes MySQL”. `DESINSTALA COMPONENT` é o complemento de `INSTALA COMPONENT`. Requer o privilégio `DELETE` para a tabela de sistema `mysql.component` porque remove a linha dessa tabela que registra o componente. `DESINSTALA COMPONENT` não desfaz variáveis persistentes, incluindo as variáveis persistentes usando `INSTALA COMPONENT ... SET PERSIST`.

Exemplo:

```
UNINSTALL COMPONENT 'file://component1', 'file://component2';
```

Para informações sobre o nome dos componentes, consulte a Seção 15.7.4.3, “Declaração de INSTALAÇÃO DE COMPONENTES”.

Se ocorrer algum erro, a declaração falha e não tem efeito. Por exemplo, isso acontece se o nome de um componente estiver incorreto, um componente nomeado não estiver instalado ou não puder ser desinstalado porque outros componentes instalados dependem dele.

Um serviço de carregador lida com a desinstalação de componentes, o que inclui remover componentes desinstalados da tabela de sistema `mysql.component` que serve como um registro. Como resultado, componentes desinstalados não são carregados durante a sequência de inicialização para reinicializações subsequentes do servidor.

Observação

Esta declaração não tem efeito para componentes de chave, que são carregados usando um arquivo de manifesto e não podem ser desinstalados. Consulte a Seção 8.4.5.2, “Instalação de Componentes de Chave”.