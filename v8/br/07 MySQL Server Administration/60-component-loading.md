### 7.5.1 Instalação e desinstalação de componentes

Os componentes devem ser carregados no servidor antes de serem usados. O MySQL suporta o carregamento manual de componentes no tempo de execução e o carregamento automático durante a inicialização do servidor.

Enquanto um componente está carregado, as informações sobre o mesmo estão disponíveis, conforme descrito na secção 7.5.2, "Obtenção de informações sobre o componente".

As instruções SQL `INSTALL COMPONENT` e `UNINSTALL COMPONENT` permitem o carregamento e descarregamento de componentes. Por exemplo:

```
INSTALL COMPONENT 'file://component_validate_password';
UNINSTALL COMPONENT 'file://component_validate_password';
```

Um serviço de carregador lida com o carregamento e descarregamento de componentes e também registra componentes carregados na tabela de sistema `mysql.component`.

As instruções SQL para manipulação de componentes afetam a operação do servidor e a tabela do sistema `mysql.component` da seguinte forma:

- \[`INSTALL COMPONENT`] carrega componentes no servidor. Os componentes ficam ativos imediatamente. O serviço de carregador também registra componentes carregados na tabela de sistema \[`mysql.component`]. Para reinicializações subsequentes do servidor, o serviço de carregador carrega quaisquer componentes listados em \[`mysql.component`] durante a sequência de inicialização. Isso ocorre mesmo que o servidor seja iniciado com a opção \[`--skip-grant-tables`]. A cláusula \[`SET`] opcional permite definir valores variáveis do sistema do componente quando você instala componentes.
- O serviço de carregador também desregistra os componentes da tabela de sistema `mysql.component` para que o servidor não os carregue mais durante sua sequência de inicialização para reinicializações subsequentes.

Em comparação com a instrução correspondente `INSTALL PLUGIN` para plugins de servidor, a instrução `INSTALL COMPONENT` para componentes oferece a vantagem significativa de que não é necessário conhecer qualquer sufixo de nome de arquivo específico de plataforma para nomear o componente.

Um componente, quando instalado, também pode instalar automaticamente funções carregáveis relacionadas. Se assim for, o componente, quando desinstalado, também desinstala automaticamente essas funções.
