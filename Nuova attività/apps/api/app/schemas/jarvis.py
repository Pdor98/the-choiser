from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class JarvisResponseProxyRequest(BaseModel):
    model: Optional[str] = None
    instructions: str = ""
    input: List[Dict[str, Any]] = Field(default_factory=list)
    tools: List[Dict[str, Any]] = Field(default_factory=list)
    parallel_tool_calls: bool = False
    store: bool = False
