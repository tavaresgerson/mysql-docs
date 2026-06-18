#### 15.7.4.5. Desinstalar componente Statement

```
UNINSTALL COMPONENT component_name [, component_name ] ...
```

Esta declaração desativa e desinstala um ou mais componentes. Um componente fornece serviços que estão disponíveis para o servidor e outros componentes; consulte a Seção 7.5, “Componentes do MySQL”. `UNINSTALL COMPONENT` é o complemento de `INSTALL COMPONENT`. Ele requer o privilégio `DELETE` para a tabela do sistema `mysql.component`, porque ele remove a linha daquela tabela que registra o componente. `UNINSTALL COMPONENT` não desfaz variáveis persistentes, incluindo as variáveis persistentes usando `INSTALL COMPONENT ... SET PERSIST`.

Exemplo:

```
UNINSTALL COMPONENT 'file://component1', 'file://component2';
```

Para obter informações sobre o nome dos componentes, consulte a Seção 15.7.4.3, “Instrução de Instalação do Componente”.

Se ocorrer algum erro, a declaração falhará e não terá efeito. Por exemplo, isso acontece se o nome de um componente estiver incorreto, se um componente nomeado não estiver instalado ou não puder ser desinstalado porque outros componentes instalados dependem dele.

Um serviço de carregamento gerencia o descarregamento de componentes, o que inclui a remoção de componentes desinstalados da tabela de sistema `mysql.component` que serve como um registro. Como resultado, os componentes descarregados não são carregados durante a sequência de inicialização para reinicializações subsequentes do servidor.

Nota

Esta declaração não tem efeito para os componentes do keychain, que são carregados usando um arquivo de manifesto e não podem ser desinstalados. Consulte a Seção 8.4.4.2, “Instalação de Componentes do Keychain”.
